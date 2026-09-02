"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { parseBold } from "@/lib/parse-bold";

// Réutilisé par l'écran d'entrée (Phase 1) et La Lettre (2C.1) — même mécanique
// d'apparition lettre par lettre, avec support minimal du **gras**.
export function Typewriter({
  text,
  speedMs = 40,
  onDone,
  className,
}: {
  text: string;
  speedMs?: number;
  onDone?: () => void;
  className?: string;
}) {
  // Les marqueurs ** ne comptent pas comme des caractères "tapés" — on anime le
  // texte visible (sans marqueurs), pas la syntaxe markdown.
  const segments = useMemo(() => parseBold(text), [text]);
  const plainLength = useMemo(
    () => segments.reduce((sum, s) => sum + s.text.length, 0),
    [segments],
  );

  const [revealedCount, setRevealedCount] = useState(0);
  // Lu une seule fois au montage (lazy initializer) : accéder à window.matchMedia
  // pendant le rendu lui-même n'est pas autorisé côté serveur.
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // ref plutôt que dépendance directe : évite de redémarrer l'animation si le
  // parent repasse une nouvelle fonction onDone à chaque rendu.
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (reducedMotion || plainLength === 0) {
      onDoneRef.current?.();
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setRevealedCount(i);
      if (i >= plainLength) {
        clearInterval(interval);
        onDoneRef.current?.();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [plainLength, speedMs, reducedMotion]);

  const budget = reducedMotion ? Infinity : revealedCount;
  let remaining = budget;
  const nodes: React.ReactNode[] = [];
  for (let idx = 0; idx < segments.length && remaining > 0; idx++) {
    const seg = segments[idx];
    const take = Math.min(seg.text.length, remaining);
    if (take <= 0) continue;
    const slice = seg.text.slice(0, take);
    nodes.push(seg.bold ? <strong key={idx}>{slice}</strong> : slice);
    remaining -= take;
  }

  return <p className={className}>{nodes}</p>;
}
