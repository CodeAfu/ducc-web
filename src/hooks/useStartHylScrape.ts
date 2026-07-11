import { useMutation } from "@tanstack/react-query";

interface StartScrapePayload {
  limit: number;
  sortBy?: string;
}

export interface StartScrapeData {
  id: number;
  description?: string;
  created_by_email: string;
  scrape_begin: string;
  scrape_end: string;
  created_at: string;
  updated_at: string;
  errors: string[];
}

interface RawStartScrapeData extends Partial<StartScrapeData> {
  ID?: number;
}

/**
 * Creates a scrape session, then starts it, and returns the session used by
 * the SSE endpoint.
 *
 * API flow:
 *   1. POST /api/v3/hylscraper/scrape        → Create (allocates a session row)
 *   2. POST /api/v3/hylscraper/{id}/start    → Start  (fires off the scrape goroutine)
 *
 * After both succeed the caller can open the SSE stream at:
 *   GET /api/v3/hylscraper/{id}/subscribe
 */
export function useStartHylScrape(getToken: () => Promise<string | null>) {
  return useMutation<StartScrapeData, Error, StartScrapePayload>({
    mutationFn: async ({ limit, sortBy }) => {
      const token = await getToken();
      if (!token) throw new Error("Unauthorized");

      // Step 1 — Create session
      const createRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v3/hylscraper/scrape`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!createRes.ok) throw new Error(await createRes.text());

      const raw = (await createRes.json()) as RawStartScrapeData;
      const id = raw.id ?? raw.ID;
      if (typeof id !== "number") {
        throw new Error("Scrape response did not include a session ID");
      }

      // Step 2 — Start the scrape goroutine
      const startParams = new URLSearchParams({ limit: String(limit) });
      if (sortBy) startParams.set("sort-by", sortBy);

      const startRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v3/hylscraper/${id}/start?${startParams}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!startRes.ok) throw new Error(await startRes.text());

      const started = (await startRes.json()) as RawStartScrapeData;
      return { ...started, id } as StartScrapeData;
    },
  });
}
