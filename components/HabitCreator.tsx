'use client';

import { useState } from 'react';

export default function HabitCreator({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState('');

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Drink water"
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Add Habit</button>
        <button type="button" onClick={() => { setName('Daily coding'); }} className="px-3 py-2 border rounded">Example</button>
      </div>
    </form>
  );
}
