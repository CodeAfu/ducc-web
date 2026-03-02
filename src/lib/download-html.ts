import html2canvas from "html2canvas";

export async function downloadHTMLAsImage(elementId: string, fileName: string) {
  const bingoElement = document.getElementById(elementId);

  if (!bingoElement) {
    throw Error(`HTML Element with ID '${elementId}' does not exist.`);
  }

  const canvas = await html2canvas(bingoElement);
  const link = document.createElement("a");
  link.download = fileName + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
