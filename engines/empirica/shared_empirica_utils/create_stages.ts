export interface StageDefinition {
  name: string;
  duration: number;
}

export function addStages(round: { addStage: (stage: StageDefinition) => unknown }, stages: StageDefinition[]) {
  return stages.map((stage) => round.addStage(stage));
}

export function decisionAndFeedbackStages(decisionDuration = 120, feedbackDuration = 60): StageDefinition[] {
  return [
    { name: "Decision", duration: decisionDuration },
    { name: "Feedback", duration: feedbackDuration },
  ];
}
