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
