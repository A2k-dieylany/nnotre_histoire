"use client";

import { useEffect, useState } from "react";
import { computeElapsed, type Elapsed } from "@/lib/elapsed";

const UNITS: { key: keyof Elapsed; label: string }[] = [
  { key: "years", label: "ans" },
  { key: "months", label: "mois" },
  { key: "days", label: "jours" },
  { key: "hours", label: "heures" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "sec" },
];

export function LiveCounter({ startDate }: { startDate: string }) {
  // null pendant le rendu serveur et le premier rendu client : évite un mismatch
  // d'hydratation, "now" ne peut pas être identique entre serveur et navigateur.
  const [elapsed, setElapsed] = useState<Elapsed | null>(null);

  useEffect(() => {
    const start = new Date(startDate);

    if (Number.isNaN(start.getTime())) {
      return;
    }

    const tick = () => setElapsed(computeElapsed(start, new Date()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  if (!elapsed) {
    return <div className="h-16" aria-hidden />;
  }

  return (
    <div className="flex gap-4 text-white sm:gap-6" role="timer" aria-live="off">
      {UNITS.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center">
          <span className="font-serif text-2xl tabular-nums sm:text-3xl">
            {elapsed[key]}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/50">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
