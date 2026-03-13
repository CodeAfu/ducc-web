import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Result } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function tryCatch<T, E = Error>(promise: Promise<Result<T, E>>) {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e as E };
  }
}
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1] // strip "data:image/webp;base64,"
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

