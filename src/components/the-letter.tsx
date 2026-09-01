"use client";

import { useEffect, useRef, useState } from "react";
import { Typewriter } from "./typewriter";

type Stage = "idle" | "body" | "closing" | "done";

export function TheLetter({
  body,
  closing,
  authorFirstName,
  signatureImageUrl,
}: {
  body: string;
  closing: string;
  authorFirstName: string;
  signatureImageUrl?: string | null;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Le texte ne commence à s'écrire que quand elle scrolle jusqu'ici — pas au
  // chargement de la page, sinon l'animation se joue hors champ pendant qu'elle
  // parcourt encore la timeline au-dessus.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStage((current) => (current === "idle" ? "body" : current));
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-24"
      style={{
        background: "radial-gradient(ellipse at center, #f5ecd9 0%, #e8d9b8 100%)",
      }}
    >
      <div className="w-full max-w-lg">
        {stage !== "idle" && (
          <Typewriter
            text={body}
            speedMs={25}
            className="whitespace-pre-line font-hand text-2xl leading-relaxed text-[#3a2e1f] sm:text-3xl"
            onDone={() => setTimeout(() => setStage("closing"), 800)}
          />
        )}

        {(stage === "closing" || stage === "done") && (
          <div className="mt-8">
            {stage === "closing" ? (
              <Typewriter
                text={closing}
                speedMs={35}
                className="font-serif text-xl italic text-[#3a2e1f]"
                onDone={() => setTimeout(() => setStage("done"), 600)}
              />
            ) : (
              <p className="font-serif text-xl italic text-[#3a2e1f]">{closing}</p>
            )}
          </div>
        )}

        {stage === "done" && (
          <div className="mt-10 flex justify-end">
            {signatureImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- asset local optionnel, pas de source distante à optimiser
              <img src={signatureImageUrl} alt={authorFirstName} className="h-16" />
            ) : (
              <p className="font-hand text-4xl text-[#3a2e1f]">{authorFirstName}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
