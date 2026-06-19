export interface CleanupConfig {
  gameId?: string;
  groupId?: string;
  groupSize: number;
  numRounds: number;
  endowment: number;
  cleanupCost: number;
  pollutionStart: number;
  pollutionReductionPerEffort: number;
  treatment?: string;
}

export interface CleanupAction {
  actorId: string;
  effort: number;
  round?: number;
  timestamp?: string;
}

export interface CleanupRoundRecord {
  gameId: string;
  groupId: string;
  round: number;
  pollutionBefore: number;
  pollutionAfter: number;
  totalEffort: number;
  actions: CleanupAction[];
  timestamp: string;
}

export interface CleanupState {
  gameId: string;
  groupId: string;
  config: Required<CleanupConfig>;
  round: number;
  actorIds: string[];
  pollution: number;
  history: CleanupRoundRecord[];
  ended: boolean;
}

