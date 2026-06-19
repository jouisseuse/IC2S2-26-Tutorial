export interface ModelRequest {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, unknown>;
}

export interface ModelResponse {
  rawResponse: string;
  parsedAction: Record<string, unknown> | null;
  modelProvider: string;
  modelName: string;
  latencyMs: number;
  error?: string | null;
}

export interface BaseModelClient {
  provider: string;
  modelName: string;
  generate(request: ModelRequest): Promise<ModelResponse>;
}

export function parseJSONFromText(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}
