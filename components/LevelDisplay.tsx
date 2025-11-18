export default function LevelDisplay({ xp, level }: { xp: number; level: number; }) {
    const levelXp = xp % 100;
    const pct = Math.floor((levelXp / 100) * 100);
  
    return (
      <div className="text-right">
        <div className="text-sm">Level {level}</div>
        <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
          <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }
  