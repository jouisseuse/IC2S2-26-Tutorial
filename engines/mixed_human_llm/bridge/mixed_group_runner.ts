import type { BaseAgent } from "../../llm_simulation/agents/base_agent";
import { mergeActions, type SharedActionRecord } from "./action_merger";
import { collectLLMAction } from "./llm_action_collector";

export async function runLLMTurnsForMixedGroup(options: {
  llmAgents: BaseAgent[];
  observationsByActor: Record<string, Record<string, unknown>>;
  gameId: string;
  groupId: string;
  round: number;
  stage: string;
  treatment?: string | null;
  humanActions?: SharedActionRecord[];
}) {
  const llmActions = await Promise.all(
    options.llmAgents.map((agent) =>
      collectLLMAction({
        agent,
        observation: options.observationsByActor[agent.actorId] || {},
        gameId: options.gameId,
        groupId: options.groupId,
        round: options.round,
        stage: options.stage,
        treatment: options.treatment,
      })
    )
  );

  return mergeActions([...(options.humanActions || []), ...llmActions]);
}
