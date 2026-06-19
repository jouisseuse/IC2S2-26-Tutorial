import { readFileSync } from "node:fs";

export function loadJSONConfig<T = Record<string, unknown>>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function readTextConfig(path: string): string {
  return readFileSync(path, "utf8");
}
