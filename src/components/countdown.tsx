"use client";

import { useEffect, useState } from "react";

export function Countdown({ label, date }: { label: string; date: string }) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(date);
    if (Number.isNaN(target.getTime())) return;

    const now = new Date();
    const msLeft = target.getTime() - now.getTime();
    const days = Math.ceil(msLeft / 86_400_000);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dépend de "maintenant" côté visiteur, pas dérivable au rendu serveur
    setDaysLeft(days);
  }, [date]);

  if (daysLeft === null) return null;

  return (
    <p className="text-center text-sm text-muted">
      {label} —{" "}
      {daysLeft > 0 ? (
        <span className="text-wine">
          dans {daysLeft} {daysLeft === 1 ? "jour" : "jours"}
        </span>
      ) : daysLeft === 0 ? (
        <span className="text-wine">c&apos;est aujourd&apos;hui 🎉</span>
      ) : (
        <span className="text-muted/60">passé</span>
      )}
    </p>
  );
}
