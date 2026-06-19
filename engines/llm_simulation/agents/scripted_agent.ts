import type { AgentAction, AgentObservation, BaseAgent } from "./base_agent";

export class ScriptedAgent implements BaseAgent {
  actorType = "scripted" as const;
  actorId: string;
  policy: (observation: AgentObservation) => Record<string, unknown>;

  constructor(
    actorId: string,
    policy: (observation: AgentObservation) => Record<string, unknown>
  ) {
    this.actorId = actorId;
    this.policy = policy;
  }

  act(observation: AgentObservation): AgentAction {
    return {
      actorId: this.actorId,
      actorType: this.actorType,
      ...this.policy(observation),
    };
  }
}

export function halfContributionPolicy(observation: AgentObservation) {
  const endowment = Number(observation.endowment ?? 10);
  return { action_type: "contribution", contribution: Math.round(endowment / 2) };
}
