"use client";

import { useEffect, useState } from "react";

function dayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export function DailyQuote({ quotes }: { quotes: readonly string[] }) {
  // Calculé côté client uniquement : le jour du visiteur dépend de son fuseau,
  // un calcul serveur créerait le même risque de mismatch d'hydratation déjà
  // rencontré ailleurs (Starfield, minuit).
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    if (quotes.length === 0) return;
    const index = dayOfYear(new Date()) % quotes.length;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dépend du jour local du visiteur, pas dérivable au rendu serveur
    setQuote(quotes[index]);
  }, [quotes]);

  if (!quote) return null;

  return (
    <p className="max-w-sm text-center font-hand text-xl text-white/70">
      « {quote} »
    </p>
  );
}
