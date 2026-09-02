"use client";

import { useEffect, useRef, useState } from "react";
import { Typewriter } from "./typewriter";
import { FormattedText } from "./formatted-text";

type Stage = "idle" | "body" | "closing" | "done";

// Lettre longue -> animation longue. La rejouer en entier à CHAQUE visite (elle
// reviendra relire la lettre pendant des années, pas juste le jour J) serait
// pénible. Mémorisé par appareil/navigateur, pas de compte à synchroniser pour ça.
const LETTER_SEEN_KEY = "notre-histoire:letter-seen";

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

  // Déjà vue sur cet appareil : on saute directement au texte complet, pas
  // d'animation à rejouer. Ne peut être vérifié que côté client (localStorage
  // absent côté serveur) — d'où l'effect plutôt qu'un lazy initializer.
  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = localStorage.getItem(LETTER_SEEN_KEY) === "1";
    } catch {
      // Navigation privée ou stockage bloqué : on retombe sur l'animation normale.
    }
    if (alreadySeen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lu une fois au montage depuis un état navigateur, pas dérivable du rendu serveur
      setStage("done");
    }
  }, []);

  // Marque la lettre comme vue une fois l'animation terminée.
  useEffect(() => {
    if (stage !== "done") return;
    try {
      localStorage.setItem(LETTER_SEEN_KEY, "1");
    } catch {
      // Stockage indisponible : l'animation se rejouera la prochaine fois, tant pis.
    }
  }, [stage]);

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
        {stage === "body" && (
          <Typewriter
            text={body}
            speedMs={10}
            className="whitespace-pre-line font-hand text-2xl leading-relaxed text-[#3a2e1f] sm:text-3xl"
            onDone={() => setTimeout(() => setStage("closing"), 800)}
          />
        )}
        {(stage === "closing" || stage === "done") && (
          <FormattedText
            text={body}
            className="whitespace-pre-line font-hand text-2xl leading-relaxed text-[#3a2e1f] sm:text-3xl"
          />
        )}

        {stage === "closing" && (
          <div className="mt-8">
            {/* Typewriter gère text="" tout seul (onDone immédiat) : pas de cas particulier à coder ici. */}
            <Typewriter
              text={closing}
              speedMs={35}
              className="font-serif text-xl italic text-[#3a2e1f]"
              onDone={() => setTimeout(() => setStage("done"), 600)}
            />
          </div>
        )}
        {stage === "done" && closing && (
          <div className="mt-8">
            <FormattedText text={closing} className="font-serif text-xl italic text-[#3a2e1f]" />
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
