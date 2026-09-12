"use client";

import { useEffect, useState } from "react";

function dateToCode(isoDate: string) {
  // "2022-06-08" -> "08062022" (JJMMAAAA), le format qu'on tape naturellement au clavier.
  const [year, month, day] = isoDate.split("-");
  return `${day}${month}${year}`;
}

const STAR_CLICKS_KEY = "hiddenStarClicks";
const STAR_CLICKS_NEEDED = 5;

// EE.6 — au-delà de l'accélération normale de la marche/manipulation du
// téléphone, en-deçà d'un vrai coup sur le sol (pas de faux positif au trajet).
const SHAKE_THRESHOLD = 18;
const SHAKE_COOLDOWN_MS = 3000;

type MotionPermissionEvent = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export function EasterEggs({
  secretCodeDate,
  secretCodeMessage,
  midnightMessage,
  hiddenStarMessage,
  shakeMessages,
}: {
  secretCodeDate: string;
  secretCodeMessage: string;
  midnightMessage: string;
  hiddenStarMessage: string;
  shakeMessages: readonly string[];
}) {
  const [message, setMessage] = useState<string | null>(null);

  // EE.3 — l'étoile cachée : persistée pour compter à travers plusieurs visites,
  // pas seulement dans la session courante (la trouver peut prendre du temps).
  function handleStarClick() {
    let count = 0;
    try {
      count = Number(localStorage.getItem(STAR_CLICKS_KEY) ?? "0") + 1;
      localStorage.setItem(STAR_CLICKS_KEY, String(count));
    } catch {
      count = STAR_CLICKS_NEEDED; // stockage indisponible (navigation privée) : ne bloque pas la surprise
    }
    if (count % STAR_CLICKS_NEEDED === 0) {
      setMessage(hiddenStarMessage);
    }
  }

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
    const code = dateToCode(secretCodeDate);
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
  }, [secretCodeDate, secretCodeMessage]);

  // EE.6 — le shake secret. iOS 13+ exige une permission explicite liée à un
  // geste utilisateur pour lire l'accéléromètre ; comme un bouton dédié
  // casserait l'effet de surprise, on la demande discrètement au premier tap
  // n'importe où sur la page (déjà présent partout dans l'app). Android n'a
  // besoin d'aucune permission et écoute directement.
  useEffect(() => {
    if (shakeMessages.length === 0) return;

    let lastShakeAt = 0;
    let lastMagnitude = 0;

    function handleMotion(e: DeviceMotionEvent) {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      const delta = Math.abs(magnitude - lastMagnitude);
      lastMagnitude = magnitude;

      const now = Date.now();
      if (delta > SHAKE_THRESHOLD && now - lastShakeAt > SHAKE_COOLDOWN_MS) {
        lastShakeAt = now;
        const index = Math.floor(Math.random() * shakeMessages.length);
        setMessage(shakeMessages[index]);
      }
    }

    function armMotionListener() {
      window.addEventListener("devicemotion", handleMotion);
    }

    const motionEvent = window.DeviceMotionEvent as MotionPermissionEvent | undefined;

    if (typeof motionEvent?.requestPermission === "function") {
      function requestOnFirstTap() {
        motionEvent!
          .requestPermission!()
          .then((state) => {
            if (state === "granted") armMotionListener();
          })
          .catch(() => {
            // Permission refusée : le shake ne marchera pas sur cet appareil, tant pis.
          });
        document.removeEventListener("click", requestOnFirstTap);
      }
      document.addEventListener("click", requestOnFirstTap);
      return () => document.removeEventListener("click", requestOnFirstTap);
    }

    armMotionListener();
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [shakeMessages]);

  return (
    <>
      <button
        type="button"
        onClick={handleStarClick}
        tabIndex={-1}
        className="fixed right-3 top-3 z-30 text-xs text-wine/10 transition hover:text-wine/30"
      >
        ✨
      </button>

      {message && (
        <div
          role="alertdialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-wine/95 px-6"
          onClick={() => setMessage(null)}
        >
          <p className="max-w-sm text-center font-hand text-3xl text-cream">
            {message}
          </p>
        </div>
      )}
    </>
  );
}
