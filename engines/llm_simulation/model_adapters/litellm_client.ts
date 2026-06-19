import type { BaseModelClient, ModelRequest, ModelResponse } from "./base_model_client";
import { nowMs, parseJSONFromText } from "./base_model_client";

export class LiteLLMModelClient implements BaseModelClient {
  provider = "litellm";
  modelName: string;
  apiKey: string;
  baseUrl: string;

  constructor(options: { apiKey?: string; baseUrl?: string; modelName?: string } = {}) {
    this.apiKey = options.apiKey || process.env.LITELLM_API_KEY || "";
    this.baseUrl = options.baseUrl || process.env.LITELLM_BASE_URL || "";
    this.modelName = options.modelName || process.env.DEFAULT_MODEL || "openai/gpt-4o-mini";
  }

  async generate(request: ModelRequest): Promise<ModelResponse> {
    if (!this.baseUrl) {
      throw new Error("LITELLM_BASE_URL is required for LiteLLMModelClient");
    }

    const start = nowMs();
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: this.apiKey ? `Bearer ${this.apiKey}` : "",
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
      throw new Error(`LiteLLM request failed: ${response.status} ${await response.text()}`);
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
