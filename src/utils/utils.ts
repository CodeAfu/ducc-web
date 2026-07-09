
export function base64ToBytes(base64String: string) {
  const byteChars = atob(base64String);
  const byteNumbers = new Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return byteNumbers;
}

// const res = await fetch(`/api/v3/hylscraper/${sessionId}/stream`, {
//   headers: { Authorization: `Bearer ${token}` },
// });
//
// const reader = res.body!.getReader();
// const decoder = new TextDecoder();
// let buffer = "";
//
// while (true) {
//   const { done, value } = await reader.read();
//   if (done) break;
//
//   buffer += decoder.decode(value, { stream: true });
//
//   // SSE events are separated by double newline
//   const events = buffer.split("\n\n");
//   buffer = events.pop()!; // keep incomplete last chunk
//
//   for (const event of events) {
//     const lines = event.split("\n");
//     let eventType = "message";
//     let data = "";
//
//     for (const line of lines) {
//       if (line.startsWith("event: ")) eventType = line.slice(7);
//       if (line.startsWith("data: ")) data = line.slice(6);
//     }
//
//     if (eventType === "done") { /* stream finished */ break; }
//     if (data) {
//       const post = JSON.parse(data);
//       // do something with post
//     }
//   }
// }
