import type { BaseModelClient, ModelRequest, ModelResponse } from "./base_model_client";
import { nowMs, parseJSONFromText } from "./base_model_client";

export class MockModelClient implements BaseModelClient {
  provider = "mock";
  modelName: string;

  constructor(modelName = "mock-deterministic") {
    this.modelName = modelName;
  }

  async generate(request: ModelRequest): Promise<ModelResponse> {
    const start = nowMs();
    const action = this.chooseAction(request);
    const rawResponse = JSON.stringify(action);
    return {
      rawResponse,
      parsedAction: parseJSONFromText(rawResponse),
      modelProvider: this.provider,
      modelName: request.model || this.modelName,
      latencyMs: Math.round(nowMs() - start),
      error: null,
    };
  }

  private chooseAction(request: ModelRequest): Record<string, unknown> {
    const metadata = request.metadata || {};
    if (metadata.gameType === "social_learning") {
      return {
        action_type: "estimate",
        estimate: Number(metadata.privateSignal ?? metadata.previousGroupAverage ?? 50),
        confidence: 0.6,
      };
    }
    if (metadata.gameType === "coordination") {
      return {
        action_type: "choice",
        choice: metadata.previousMajorityChoice || "A",
        reason: "Mock agent chooses a stable coordination option.",
      };
    }
    const endowment = Number(metadata.endowment ?? 10);
    return {
      action_type: "contribution",
      contribution: Math.round(endowment / 2),
      reason: "Mock agent contributes half of the endowment.",
    };
  }
}
