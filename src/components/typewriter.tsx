"use client";

import { useEffect, useRef, useState } from "react";

// Réutilisé par l'écran d'entrée (Phase 1) et plus tard par La Lettre (2C.1) —
// même mécanique d'apparition lettre par lettre.
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
  const [shown, setShown] = useState("");
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
    if (reducedMotion || text.length === 0) {
      // Pas de setState synchrone ici : le texte complet est rendu directement (voir ci-dessous).
      onDoneRef.current?.();
      return;
    }

    // Pas de reset explicite : `shown` démarre déjà à "" à l'initialisation du state.
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDoneRef.current?.();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, speedMs, reducedMotion]);

  return <p className={className}>{reducedMotion ? text : shown}</p>;
}
