"use client";

import { useEffect, useState } from "react";
import type { Habit } from "../lib/habits";

export default function HabitTarget({
  habit,
  stylePos,
  onShoot,
}: {
  habit: Habit;
  stylePos?: { x: number; y: number } | undefined;
  onShoot: () => void;
}) {
  const [hit, setHit] = useState(false);

  useEffect(() => {
    if (!hit) return;
    const t = setTimeout(() => setHit(false), 400);
    return () => clearTimeout(t);
  }, [hit]);

  // position absolute using percentage coords
  const left = stylePos ? `${stylePos.x}%` : "10%";
  const top = stylePos ? `${stylePos.y}%` : "10%";

  return (
    <div
      className={`absolute cursor-crosshair transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700`}
      style={{ left, top }}
      onClick={() => { setHit(true); onShoot(); }}
      title={habit.name + (habit.completedToday ? " (completed today)" : "")}
    >
      <div className={`w-36 p-3 rounded-lg shadow-lg text-center select-none ${habit.completedToday ? "bg-green-100 opacity-70" : "bg-white"}`}>
        <div className={`text-sm font-semibold ${hit ? "text-red-600" : "text-slate-800"}`}>
          {habit.name}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {habit.completedToday ? "Done ✓" : "Tap to complete"}
        </div>
      </div>
    </div>
  );
}
