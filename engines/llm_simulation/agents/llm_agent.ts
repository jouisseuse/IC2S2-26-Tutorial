import type { BaseModelClient } from "../model_adapters/base_model_client";
import type { AgentAction, AgentObservation, BaseAgent } from "./base_agent";

export class LLMAgent implements BaseAgent {
  actorType = "llm" as const;
  actorId: string;
  modelClient: BaseModelClient;
  systemPrompt: string;
  decisionPrompt: string;

  constructor(options: {
    actorId: string;
    modelClient: BaseModelClient;
    systemPrompt: string;
    decisionPrompt: string;
  }) {
    this.actorId = options.actorId;
    this.modelClient = options.modelClient;
    this.systemPrompt = options.systemPrompt;
    this.decisionPrompt = options.decisionPrompt;
  }

  async act(observation: AgentObservation): Promise<AgentAction> {
    const response = await this.modelClient.generate({
      systemPrompt: this.systemPrompt,
      userPrompt: renderTemplate(this.decisionPrompt, observation),
      metadata: observation,
    });
    return {
      actorId: this.actorId,
      actorType: this.actorType,
      ...(response.parsedAction || {}),
      rawResponse: response.rawResponse,
      modelProvider: response.modelProvider,
      modelName: response.modelName,
      latencyMs: response.latencyMs,
    };
  }
}

export function renderTemplate(template: string, values: Record<string, unknown>): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) =>
    String(values[key] ?? "")
  );
}
