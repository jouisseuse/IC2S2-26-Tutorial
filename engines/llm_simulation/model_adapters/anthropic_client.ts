import type { BaseModelClient, ModelRequest, ModelResponse } from "./base_model_client";
import { nowMs, parseJSONFromText } from "./base_model_client";

export class AnthropicModelClient implements BaseModelClient {
  provider = "anthropic";
  modelName: string;
  apiKey: string;

  constructor(options: { apiKey?: string; modelName?: string } = {}) {
    this.apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY || "";
    this.modelName = options.modelName || "claude-3-5-haiku-latest";
  }

  async generate(request: ModelRequest): Promise<ModelResponse> {
    if (!this.apiKey) {
      throw new Error("ANTHROPIC_API_KEY is required unless USE_MOCK_MODEL=true");
    }

    const start = nowMs();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model || this.modelName,
        system: request.systemPrompt,
        temperature: request.temperature ?? 0,
        max_tokens: request.maxTokens ?? 256,
        messages: [{ role: "user", content: request.userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic request failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const rawResponse =
      data.content?.map((part: { text?: string }) => part.text || "").join("") || "";
    return {
      rawResponse,
      parsedAction: parseJSONFromText(rawResponse),
      modelProvider: this.provider,
      modelName: request.model || this.modelName,
      latencyMs: Math.round(nowMs() - start),
      error: null,
    };
  }
}
