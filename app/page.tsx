'use client';

import { useEffect, useMemo, useState } from "react";
import HabitCreator from "../components/HabitCreator";
import HabitTarget from "../components/HabitTarget";
import LevelDisplay from "../components/LevelDisplay";
import {
  loadState,
  saveState,
  createHabit,
  markHabitCompleted,
  resetCompletionsIfNewDay,
  Habit
} from "../lib/habits";
import { addXp, xpForDisplay, getLevelFromXp } from "../lib/xp";

export default function HomePage() {
  // single source of truth (loaded/saved to localStorage)
  const [state, setState] = useState(() => {
    const loaded = loadState();
    const s = resetCompletionsIfNewDay(loaded);
    if (s !== loaded) {
      saveState(s);
    }
    return s;
  });

  // positions for targets (in viewport coords)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  // trigger a re-render every second to move targets
  useEffect(() => {
    // init positions
    const pos: Record<string, { x: number; y: number }> = {};
    for (const h of state.habits) {
      pos[h.id] = randomPos();
    }
    setPositions(pos);

    const interval = setInterval(() => {
      setPositions((prev) => {
        const next = { ...prev };
        for (const id of Object.keys(next)) {
          next[id] = randomPos();
        }
        return next;
      });
    }, 2000);

    // daily midnight reset check
    const dayCheck = setInterval(() => {
      setState((cur) => {
        const updated = resetCompletionsIfNewDay(cur);
        if (updated !== cur) {
          saveState(updated);
          return updated;
        }
        return cur;
      });
    }, 60_000);

    return () => { clearInterval(interval); clearInterval(dayCheck); };
  }, []); // eslint-disable-line

  // helper: add habit
  const handleCreate = (name: string) => {
    const next = createHabit(state, name);
    setState(next);
    // add initial random pos
    setPositions((p) => ({ ...p, [next.habits[next.habits.length - 1].id]: randomPos() }));
    saveState(next);
  };

  // shoot target: mark completed for today and give xp
  const handleShoot = (habit: Habit) => {
    if (habit.completedToday) return;
    const next = markHabitCompleted(state, habit.id);
    const xpGain = 10;
    const xpUpdated = addXp(next, xpGain);
    setState(xpUpdated);
    saveState(xpUpdated);
  };

  const level = useMemo(() => getLevelFromXp(state.xp), [state.xp]);

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Habit Shooter</h1>
        <LevelDisplay xp={state.xp} level={level} />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Create Habit</h2>
            <HabitCreator onCreate={handleCreate} />
            <hr className="my-4" />
            <div className="text-sm text-gray-600">
              <p><strong>XP:</strong> {xpForDisplay(state.xp)}</p>
              <p><strong>Total check-ins:</strong> {state.totalCompletions}</p>
              <p className="mt-2 text-xs text-gray-500">Click a target to complete today’s habit. Targets move every 2s.</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 relative h-[60vh] bg-gradient-to-b from-white to-slate-50 border rounded overflow-hidden">
          {state.habits.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No habits yet — create one!
            </div>
          ) : null}

          {state.habits.map((h) => (
            <HabitTarget
              key={h.id}
              habit={h}
              stylePos={positions[h.id]}
              onShoot={() => handleShoot(h)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// returns a random position inside visible play area (percentage)
function randomPos() {
  // keep some padding
  const x = Math.floor(8 + Math.random() * 84);
  const y = Math.floor(8 + Math.random() * 84);
  return { x, y };
}
