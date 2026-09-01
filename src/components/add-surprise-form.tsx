"use client";

import { useActionState, useEffect, useState } from "react";
import { addUnlockableContent } from "@/app/unlockable-actions";

// Demain, au format YYYY-MM-DD attendu par <input type="date"> — une surprise
// programmée "aujourd'hui" se déverrouillerait tout de suite, ça n'a pas de sens.
function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function AddSurpriseForm() {
  const [state, action, pending] = useActionState(addUnlockableContent, null);
  // Calculé après montage, pas en lazy initializer : "aujourd'hui" dépend du fuseau
  // du visiteur, un calcul pendant le rendu serveur donnerait une date différente
  // et recréerait le même genre de mismatch d'hydratation déjà rencontré (Starfield).
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- calcul ponctuel au montage, dépend du fuseau du visiteur
    setMinDate(tomorrowIso());
  }, []);

  return (
    <form action={action} className="flex w-full max-w-md flex-col gap-3">
      <input
        type="text"
        name="title"
        placeholder="Titre (elle ne le verra qu'au déverrouillage)"
        required
        maxLength={120}
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <label className="text-xs text-white/50">
        Se déverrouille le
        <input
          type="date"
          name="unlock_at"
          required
          min={minDate}
          className="mt-1 block w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-white/50 focus:outline-none"
        />
      </label>
      <textarea
        name="body"
        placeholder="Texte (lettre du futur) — laisse vide si tu mets juste une photo"
        rows={3}
        maxLength={2000}
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <input
        type="file"
        name="media"
        accept="image/*"
        className="text-xs text-white/60 file:mr-3 file:rounded-md file:border file:border-white/20 file:bg-transparent file:px-3 file:py-1.5 file:text-xs file:text-white"
      />
      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-white/30 px-4 py-2 text-xs tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        {pending ? "…" : "Programmer la surprise"}
      </button>
    </form>
  );
}
