import type { AgentAction, AgentObservation, BaseAgent } from "./base_agent";

export class RandomAgent implements BaseAgent {
  actorType = "random" as const;
  actorId: string;
  random: () => number;

  constructor(actorId: string, random: () => number = Math.random) {
    this.actorId = actorId;
    this.random = random;
  }

  act(observation: AgentObservation): AgentAction {
    if (Array.isArray(observation.choices)) {
      const choices = observation.choices as string[];
      return {
        actorId: this.actorId,
        actorType: this.actorType,
        action_type: "choice",
        choice: choices[Math.floor(this.random() * choices.length)],
      };
    }
    if (observation.private_signal !== undefined) {
      return {
        actorId: this.actorId,
        actorType: this.actorType,
        action_type: "estimate",
        estimate: Number(observation.private_signal),
        confidence: 0.5,
      };
    }
    const endowment = Number(observation.endowment ?? 10);
    return {
      actorId: this.actorId,
      actorType: this.actorType,
      action_type: "contribution",
      contribution: Math.floor(this.random() * (endowment + 1)),
    };
  }
}
