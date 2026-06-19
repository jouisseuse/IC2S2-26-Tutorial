export interface AgentObservation {
  game_id?: string;
  group_id?: string;
  round?: number;
  [key: string]: unknown;
}

export interface AgentAction {
  actorId: string;
  actorType: "llm" | "scripted" | "random";
  [key: string]: unknown;
}

export interface BaseAgent {
  actorId: string;
  actorType: "llm" | "scripted" | "random";
  act(observation: AgentObservation): Promise<AgentAction> | AgentAction;
}
