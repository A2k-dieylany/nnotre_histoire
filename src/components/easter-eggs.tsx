"use client";

import { useEffect, useState } from "react";

function dateToCode(isoDate: string) {
  // "2022-06-08" -> "08062022" (JJMMAAAA), le format qu'on tape naturellement au clavier.
  const [year, month, day] = isoDate.split("-");
  return `${day}${month}${year}`;
}

export function EasterEggs({
  startDate,
  secretCodeMessage,
  midnightMessage,
}: {
  startDate: string;
  secretCodeMessage: string;
  midnightMessage: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  // EE.4 — vérifié une seule fois à l'arrivée sur la page, pas en continu.
  // Doit rester dans un effect (pas un lazy initializer useState) : l'heure du
  // visiteur n'est connue que côté client, un calcul pendant le rendu serveur
  // utiliserait l'heure du serveur et créerait un mismatch d'hydratation.
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- vérification ponctuelle au montage, pas une boucle de synchronisation
      setMessage(midnightMessage);
    }
  }, [midnightMessage]);

  // EE.1 — tape le code n'importe où sur le site (hors champ de saisie).
  useEffect(() => {
    const code = dateToCode(startDate);
    let buffer = "";

    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return;
      }
      if (!/^[0-9]$/.test(e.key)) {
        return;
      }
      buffer = (buffer + e.key).slice(-code.length);
      if (buffer === code) {
        setMessage(secretCodeMessage);
        buffer = "";
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [startDate, secretCodeMessage]);

  if (!message) {
    return null;
  }

  return (
    <div
      role="alertdialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-6"
      onClick={() => setMessage(null)}
    >
      <p className="max-w-sm text-center font-hand text-3xl text-white">
        {message}
      </p>
    </div>
  );
}
