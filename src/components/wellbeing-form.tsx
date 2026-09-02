"use client";

import { useActionState, useEffect, useState } from "react";
import { addWellbeingEntry, type CycleState } from "@/app/cycle-actions";

const MOODS = ["😴", "🥰", "😤", "🫠", "🌧️", "☀️"];

export function WellbeingForm() {
  const [state, action, pending] = useActionState<CycleState, FormData>(
    addWellbeingEntry,
    null,
  );
  // "Aujourd'hui" dépend du fuseau du visiteur : calculé après montage, pas en
  // valeur par défaut au rendu, pour ne pas rejouer le mismatch d'hydratation
  // déjà rencontré ailleurs (Starfield, date min du formulaire surprise).
  const [today, setToday] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dépend du fuseau du visiteur, pas dérivable au rendu serveur
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-3">
      <label className="text-xs text-white/50">
        Jour
        <input
          type="date"
          name="entry_date"
          required
          value={today}
          onChange={(e) => setToday(e.target.value)}
          className="mt-1 block w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-white/50 focus:outline-none"
        />
      </label>

      <fieldset className="flex gap-2">
        {MOODS.map((m) => (
          <label
            key={m}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/20 text-lg has-[:checked]:border-rose-300 has-[:checked]:bg-rose-300/20"
          >
            <input type="radio" name="mood" value={m} className="sr-only" />
            {m}
          </label>
        ))}
      </fieldset>

      <input
        type="text"
        name="symptoms"
        placeholder="Symptômes (optionnel)"
        maxLength={200}
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <textarea
        name="note"
        placeholder="Une note pour toi (optionnel)"
        rows={2}
        maxLength={500}
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />

      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-white/30 px-4 py-2 text-xs tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        {pending ? "…" : "Enregistrer ce jour"}
      </button>
    </form>
  );
}
