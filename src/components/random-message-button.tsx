"use client";

import { useState } from "react";

export function RandomMessageButton({ pool }: { pool: readonly string[] }) {
  const [shown, setShown] = useState<string | null>(null);

  function reveal() {
    if (pool.length === 0) return;
    const index = Math.floor(Math.random() * pool.length);
    setShown(pool[index]);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={reveal}
        disabled={pool.length === 0}
        className="rounded-full border border-white/30 px-6 py-3 text-sm tracking-wide text-white transition hover:bg-white/10 disabled:opacity-40"
      >
        Dis-moi quelque chose de beau
      </button>
      {pool.length === 0 && (
        <p className="text-xs text-white/40">Pas encore de message préparé.</p>
      )}
      {shown && (
        <p className="max-w-sm text-center font-hand text-2xl text-white">{shown}</p>
      )}
    </div>
  );
}
