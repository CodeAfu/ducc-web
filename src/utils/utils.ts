
export function base64ToBytes(base64String: string) {
  const byteChars = atob(base64String);
  const byteNumbers = new Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return byteNumbers;
}

interface SubscribeToHylScrapeOptions<T> {
  sessionId: number;
  token: string;
  signal: AbortSignal;
  /** Called when the server signals it is ready to stream (event: ready). */
  onReady?: (sessionId: number) => void;
  onMessage: (payload: T) => void;
}

/**
 * Opens the authenticated HYL SSE endpoint and dispatches each JSON payload.
 * Native EventSource cannot be used because this API authenticates with an
 * Authorization header.
 *
 * Named events sent by the server:
 *   event: ready  →  routed to onReady (session is live, data will follow)
 *   (no event)    →  routed to onMessage
 */
export async function subscribeToHylScrape<T>({
  sessionId,
  token,
  signal,
  onReady,
  onMessage,
}: SubscribeToHylScrapeOptions<T>): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v3/hylscraper/${sessionId}/subscribe`,
    {
      headers: {
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
      },
      signal,
    },
  );

  if (!response.ok || !response.body) {
    const detail = await response.text();
    throw new Error(detail || `SSE connection failed: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (; ;) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      const rawEvents = buffer.split(/\r?\n\r?\n/);
      buffer = rawEvents.pop() ?? "";

      for (const rawEvent of rawEvents) {
        const lines = rawEvent.split(/\r?\n/);

        // Extract the named event type if present (e.g. "event: ready")
        const eventLine = lines.find((l) => l.startsWith("event:"));
        const eventName = eventLine ? eventLine.slice(6).trim() : "";

        const data = lines
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trimStart())
          .join("\n");

        // SSE comments (e.g. `: connected`) and keep-alives have no data.
        if (!data) continue;

        if (eventName === "ready") {
          // The server signals it is live — parse the session_id and notify.
          try {
            const parsed = JSON.parse(data) as { session_id: number };
            onReady?.(parsed.session_id);
          } catch {
            // Malformed ready payload — still notify with the requested id.
            onReady?.(sessionId);
          }
          continue;
        }

        let payload: T;
        try {
          payload = JSON.parse(data) as T;
        } catch {
          throw new Error("Received an invalid JSON SSE payload");
        }

        onMessage(payload);
      }

      if (done) return;
    }
  } finally {
    reader.releaseLock();
  }
}
