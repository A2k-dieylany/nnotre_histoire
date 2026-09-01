"use client";

import { useRef, useState } from "react";
import { computeElapsed } from "@/lib/elapsed";
import { Typewriter } from "./typewriter";
import { Starfield } from "./starfield";
import { LiveCounter } from "./live-counter";

type Stage = "gesture" | "line1" | "line2" | "done";

function pluralize(n: number, singular: string, plural = `${singular}s`) {
  return n === 1 ? singular : plural;
}

export function OpeningSequence({
  startDate,
  partnerFirstName,
  songUrl,
}: {
  startDate: string;
  partnerFirstName: string;
  songUrl?: string;
}) {
  const [stage, setStage] = useState<Stage>("gesture");
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calculé une seule fois, au moment où elle entre (lazy initializer, pas un ref
  // lu pendant le rendu) — pas besoin d'un live-tick ici, le compteur temps réel
  // arrive après (stage "done").
  const [elapsed] = useState(() => computeElapsed(new Date(startDate), new Date()));

  const line1 = `Il y a ${elapsed.years} ${pluralize(elapsed.years, "an")}, ${elapsed.months} ${pluralize(elapsed.months, "mois", "mois")} et ${elapsed.days} ${pluralize(elapsed.days, "jour")}…`;
  const line2 = "notre histoire a commencé.";

  function handleEnter() {
    // Le tap est le geste utilisateur requis par les navigateurs pour autoriser
    // l'audio avec son — sans lui, play() est silencieusement bloqué (Chrome/Safari).
    if (songUrl && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // Lecture refusée (ex: format non supporté) : l'expérience visuelle continue sans musique.
      });
    }
    setStage("line1");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-black px-6 text-center">
      <Starfield visible={stage !== "gesture"} />

      {songUrl && <audio ref={audioRef} src={songUrl} loop />}

      {stage === "gesture" && (
        <button
          type="button"
          onClick={handleEnter}
          className="animate-pulse font-serif text-lg italic text-white/70 transition hover:text-white"
        >
          Touche l&apos;écran pour commencer.
        </button>
      )}

      {stage === "line1" && (
        <Typewriter
          text={line1}
          className="max-w-md font-serif text-xl italic text-white sm:text-2xl"
          onDone={() => setTimeout(() => setStage("line2"), 900)}
        />
      )}

      {(stage === "line2" || stage === "done") && (
        <div className="flex max-w-md flex-col items-center gap-6">
          {stage === "line2" ? (
            <Typewriter
              text={line2}
              className="font-serif text-xl italic text-white sm:text-2xl"
              onDone={() => setTimeout(() => setStage("done"), 1200)}
            />
          ) : (
            <p className="font-serif text-xl italic text-white sm:text-2xl">
              {line2}
            </p>
          )}

          {stage === "done" && (
            <div className="flex flex-col items-center gap-8">
              <p className="font-serif text-lg italic text-white/90">
                Et cette histoire… c&apos;est la nôtre, {partnerFirstName}.
              </p>
              <LiveCounter startDate={startDate} />
              <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-sm italic text-white/50">
                  Descends… j&apos;ai quelque chose à te montrer.
                </p>
                {/* Brief : "animation de respiration (pulse doux)" — pas un rebond */}
                <span className="animate-pulse text-2xl text-white/40" aria-hidden>
                  ↓
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
