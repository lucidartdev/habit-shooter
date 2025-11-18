import type { AppState } from "./habits";

export function addXp(state: AppState, amount: number): AppState {
  const next = { ...state, xp: (state.xp || 0) + amount };
  // save handled by caller
  return next;
}

export function getLevelFromXp(xp: number): number {
  // easy leveling: every 100 xp = +1 level starting from level 1
  return Math.floor(xp / 100) + 1;
}

export function xpForDisplay(xp: number): string {
  return `${xp} XP`;
}
