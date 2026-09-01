"use client";

import { useActionState, useEffect, useState } from "react";
import { signIn } from "./actions";

// Combien de temps le message "mauvais mot de passe" reste affiché avant de
// laisser réessayer.
const WRONG_PASSWORD_DISPLAY_MS = 3500;

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);
  const [dismissed, setDismissed] = useState(false);

  // Une nouvelle erreur (nouvel objet `state`) doit réafficher l'écran, même si
  // la précédente avait déjà été dismissée — dépend du temps qui passe (timer),
  // ne peut pas être dérivé du seul rendu.
  useEffect(() => {
    if (!state?.error) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- réaffiche l'écran pour CHAQUE nouvelle erreur, pas une synchro dérivable du rendu
    setDismissed(false);
    const timer = setTimeout(() => setDismissed(true), WRONG_PASSWORD_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const showWrongScreen = !!state?.error && !dismissed;

  if (showWrongScreen) {
    return (
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="flex flex-col items-center gap-3 text-center"
      >
        <p className="max-w-xs font-serif text-xl italic text-rose-200">
          Désolé… cette histoire n&apos;est pas la vôtre. 💔
        </p>
        <span className="text-xs text-white/40">(touche pour réessayer)</span>
      </button>
    );
  }

  return (
    <form action={action} className="flex w-full max-w-xs flex-col gap-4">
      <input
        type="email"
        name="email"
        placeholder="Ton email"
        required
        autoComplete="email"
        className="rounded-md border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <input
        type="password"
        name="password"
        placeholder="Le mot secret"
        required
        autoComplete="current-password"
        className="rounded-md border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-white/30 py-3 text-sm tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        {pending ? "…" : "Entrer"}
      </button>
    </form>
  );
}
