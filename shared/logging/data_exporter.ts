export function toJSONL(records: unknown[]): string {
  return records.map((record) => JSON.stringify(record)).join("\n") + "\n";
}

export function toCSV(records: Record<string, unknown>[]): string {
  if (records.length === 0) {
    return "";
  }
  const headers = Array.from(
    records.reduce((keys, record) => {
      Object.keys(record).forEach((key) => keys.add(key));
      return keys;
    }, new Set<string>())
  );
  const rows = records.map((record) =>
    headers.map((header) => csvEscape(record[header])).join(",")
  );
  return [headers.join(","), ...rows].join("\n") + "\n";
}

export function normalizeRecord(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      toSnakeCase(key),
      typeof value === "object" && value !== null ? JSON.stringify(value) : value,
    ])
  );
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function toSnakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

