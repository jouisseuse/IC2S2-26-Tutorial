export type ActorType = "human" | "llm" | "scripted" | "random";

export interface ScheduledActor {
  actorId: string;
  actorType: ActorType;
  order: number;
}

export function scheduleAgents(actors: Array<Omit<ScheduledActor, "order">>): ScheduledActor[] {
  return actors.map((actor, index) => ({ ...actor, order: index + 1 }));
}

export function splitByActorType(actors: ScheduledActor[]) {
  return {
    humans: actors.filter((actor) => actor.actorType === "human"),
    llms: actors.filter((actor) => actor.actorType === "llm"),
    scripted: actors.filter((actor) => actor.actorType === "scripted"),
    random: actors.filter((actor) => actor.actorType === "random"),
  };
}
