export type Habit = {
    id: string;
    name: string;
    lastCompleted?: string; // YYYY-MM-DD
    completedToday?: boolean;
  };
  
  export type AppState = {
    habits: Habit[];
    xp: number;
    totalCompletions: number;
    lastSavedDay?: string;
  };
  
  const KEY = "habit_shooter_v1";
  
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }
  
  export function loadState(): AppState {
    if (typeof window === "undefined") {
      return { habits: [], xp: 0, totalCompletions: 0 };
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const initial: AppState = { habits: [], xp: 0, totalCompletions: 0, lastSavedDay: todayISO() };
      localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as AppState;
    // compute completedToday flags
    const today = todayISO();
    parsed.habits = (parsed.habits || []).map((h) => ({
      ...h,
      completedToday: h.lastCompleted === today,
    }));
    parsed.lastSavedDay = parsed.lastSavedDay || today;
    return parsed;
  }
  
  export function saveState(state: AppState) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify({ ...state, lastSavedDay: todayISO() }));
  }
  
  // create a new habit
  export function createHabit(state: AppState, name: string): AppState {
    const id = String(Date.now()) + Math.floor(Math.random() * 1000);
    const next: AppState = {
      ...state,
      habits: [...state.habits, { id, name, lastCompleted: undefined, completedToday: false }],
    };
    saveState(next);
    return next;
  }
  
  // mark completed for today (only if not already)
  export function markHabitCompleted(state: AppState, id: string): AppState {
    const today = todayISO();
    let total = state.totalCompletions ?? 0;
    const habits = state.habits.map((h) => {
      if (h.id !== id) return h;
      if (h.lastCompleted === today) return { ...h, completedToday: true };
      total += 1;
      return { ...h, lastCompleted: today, completedToday: true };
    });
    const next: AppState = { ...state, habits, totalCompletions: total };
    saveState(next);
    return next;
  }
  
  // reset completions if day changed since lastSavedDay
  export function resetCompletionsIfNewDay(state: AppState): AppState {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastSavedDay === today) return state;
    const habits = state.habits.map((h) => ({ ...h, completedToday: false }));
    const next: AppState = { ...state, habits, lastSavedDay: today };
    saveState(next);
    return next;
  }
  