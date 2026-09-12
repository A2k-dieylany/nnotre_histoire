"use client";

import { useActionState } from "react";
import { addCycleEntry, type CycleState } from "@/app/cycle-actions";

export function AddCycleEntryForm() {
  const [state, action, pending] = useActionState<CycleState, FormData>(addCycleEntry, null);

  return (
    <form action={action} className="flex w-full max-w-xs flex-col gap-2">
      <label className="text-xs text-muted">
        Début des règles
        <input
          type="date"
          name="start_date"
          required
          className="mt-1 block w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-wine [color-scheme:light] focus:border-rose focus:outline-none"
        />
      </label>
      <label className="text-xs text-muted">
        Fin (optionnel, tu peux l&apos;ajouter plus tard)
        <input
          type="date"
          name="end_date"
          className="mt-1 block w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-wine [color-scheme:light] focus:border-rose focus:outline-none"
        />
      </label>
      {state?.error && <p className="text-sm text-rose-d">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-rose px-4 py-2 text-xs font-semibold tracking-wide text-white transition active:scale-95 hover:bg-rose-d disabled:opacity-50"
      >
        {pending ? "…" : "Enregistrer"}
      </button>
    </form>
  );
}
