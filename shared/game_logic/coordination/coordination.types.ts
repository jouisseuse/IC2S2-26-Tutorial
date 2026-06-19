export type CoordinationChoice = "A" | "B";

export interface CoordinationConfig {
  gameId?: string;
  groupId?: string;
  groupSize: number;
  numRounds: number;
  matchPayoff: number;
  mismatchPayoff: number;
  treatment?: string;
}

export interface CoordinationAction {
  actorId: string;
  choice: CoordinationChoice;
  round?: number;
  timestamp?: string;
}

export interface CoordinationRoundRecord {
  gameId: string;
  groupId: string;
  round: number;
  choices: CoordinationAction[];
  coordinated: boolean;
  majorityChoice: CoordinationChoice | null;
  timestamp: string;
}

export interface CoordinationState {
  gameId: string;
  groupId: string;
  config: Required<CoordinationConfig>;
  round: number;
  actorIds: string[];
  history: CoordinationRoundRecord[];
  ended: boolean;
}

