
export function base64ToBytes(base64String: string) {
  const byteChars = atob(base64String);
  const byteNumbers = new Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return byteNumbers;
}
