import type { BaseAgent } from "../../llm_simulation/agents/base_agent";

export async function collectLLMAction(options: {
  agent: BaseAgent;
  observation: Record<string, unknown>;
  gameId: string;
  groupId: string;
  round: number;
  stage: string;
  treatment?: string | null;
}) {
  const action = await options.agent.act(options.observation);
  return {
    action_id: `llm_${options.agent.actorId}_${options.round}_${Date.now()}`,
    actor_id: options.agent.actorId,
    actor_type: "llm" as const,
    game_id: options.gameId,
    group_id: options.groupId,
    round: options.round,
    stage: options.stage,
    action_type: String(action.action_type || "unknown"),
    action_value: action.contribution ?? action.estimate ?? action.choice ?? null,
    is_valid: true,
    validation_error: null,
    treatment: options.treatment ?? null,
    timestamp: new Date().toISOString(),
    raw_action: action,
  };
}
