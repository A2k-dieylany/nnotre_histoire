"use client";

import { useActionState } from "react";
import { addCycleEntry, type CycleState } from "@/app/cycle-actions";

export function AddCycleEntryForm() {
  const [state, action, pending] = useActionState<CycleState, FormData>(addCycleEntry, null);

  return (
    <form action={action} className="flex w-full max-w-xs flex-col gap-2">
      <label className="text-xs text-white/50">
        Nouveau début de cycle
        <input
          type="date"
          name="start_date"
          required
          className="mt-1 block w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-white/50 focus:outline-none"
        />
      </label>
      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-white/30 px-4 py-2 text-xs tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        {pending ? "…" : "Enregistrer"}
      </button>
    </form>
  );
}
