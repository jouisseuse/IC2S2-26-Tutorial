export interface SocialLearningConfig {
  gameId?: string;
  groupId?: string;
  groupSize: number;
  numRounds: number;
  trueValue?: number;
  treatment?: string;
  showGroupAverage?: boolean;
}

export interface SocialLearningAction {
  actorId: string;
  estimate: number;
  confidence?: number;
  round?: number;
  timestamp?: string;
}

export interface SocialLearningRoundRecord {
  gameId: string;
  groupId: string;
  round: number;
  estimates: SocialLearningAction[];
  groupAverage: number;
  absoluteError: number | null;
  timestamp: string;
}

export interface SocialLearningState {
  gameId: string;
  groupId: string;
  config: Required<SocialLearningConfig>;
  round: number;
  actorIds: string[];
  history: SocialLearningRoundRecord[];
  ended: boolean;
}

