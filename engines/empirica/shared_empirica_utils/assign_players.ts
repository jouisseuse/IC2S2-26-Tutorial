export function assignSequentialPlayerLabels(players: Array<{ set: (key: string, value: unknown) => void }>) {
  players.forEach((player, index) => {
    player.set("displayLabel", `Player ${index + 1}`);
  });
}

export function actorIdForPlayer(player: { id?: string; get?: (key: string) => unknown }, fallbackIndex = 0) {
  return String(player.get?.("actorId") || player.id || `player_${fallbackIndex + 1}`);
}
