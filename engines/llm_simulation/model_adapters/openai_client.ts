import type { BaseModelClient, ModelRequest, ModelResponse } from "./base_model_client";
import { nowMs, parseJSONFromText } from "./base_model_client";

export class OpenAIModelClient implements BaseModelClient {
  provider = "openai";
  modelName: string;
  apiKey: string;

  constructor(options: { apiKey?: string; modelName?: string } = {}) {
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || "";
    this.modelName = options.modelName || process.env.DEFAULT_MODEL || "gpt-4o-mini";
  }

  async generate(request: ModelRequest): Promise<ModelResponse> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is required unless USE_MOCK_MODEL=true");
    }

    const start = nowMs();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model || this.modelName,
        temperature: request.temperature ?? 0,
        max_tokens: request.maxTokens ?? 256,
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const rawResponse = data.choices?.[0]?.message?.content || "";
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
