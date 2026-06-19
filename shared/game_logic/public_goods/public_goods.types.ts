export type ActorType = "human" | "llm" | "scripted" | "random";

export type FeedbackType = "none" | "own" | "group";

export interface PublicGoodsConfig {
  gameId?: string;
  groupId?: string;
  groupSize: number;
  numRounds: number;
  endowment: number;
  multiplier: number;
  treatment?: string;
  feedbackType?: FeedbackType;
}

export interface PublicGoodsPlayerState {
  actorId: string;
  actorType: ActorType;
  totalPayoff: number;
}

export interface PublicGoodsAction {
  actorId: string;
  actorType?: ActorType;
  round?: number;
  contribution: number;
  timestamp?: string;
}

export interface PublicGoodsPayoff {
  actorId: string;
  contribution: number;
  privateReturn: number;
  publicReturn: number;
  payoff: number;
}

export interface PublicGoodsRoundRecord {
  gameId: string;
  groupId: string;
  round: number;
  treatment: string;
  totalContribution: number;
  averageContribution: number;
  multiplier: number;
  endowment: number;
  payoffs: PublicGoodsPayoff[];
  actions: PublicGoodsAction[];
  timestamp: string;
}

export interface PublicGoodsState {
  gameId: string;
  groupId: string;
  config: Required<PublicGoodsConfig>;
  round: number;
  players: PublicGoodsPlayerState[];
  history: PublicGoodsRoundRecord[];
  ended: boolean;
}

export interface PublicGoodsObservation {
  gameId: string;
  groupId: string;
  actorId: string;
  round: number;
  endowment: number;
  multiplier: number;
  groupSize: number;
  treatment: string;
  feedbackType: FeedbackType;
  previousOwnContribution: number | null;
  previousGroupAverage: number | null;
  totalPayoff: number;
  isFinalRound: boolean;
}

