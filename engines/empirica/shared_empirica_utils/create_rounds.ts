export interface RoundDefinition {
  name: string;
  task?: string;
  stages: StageDefinition[];
}

export interface StageDefinition {
  name: string;
  duration: number;
}

export function createRounds(game: { addRound: (round: Record<string, unknown>) => any }, rounds: RoundDefinition[]) {
  return rounds.map((definition) => {
    const round = game.addRound({ name: definition.name, task: definition.task });
    for (const stage of definition.stages) {
      round.addStage({ name: stage.name, duration: stage.duration });
    }
    return round;
  });
}
