"use client";

import { useActionState } from "react";
import { addPostit, type MessageState } from "@/app/messages-actions";

export function AddPostitForm() {
  const [state, action, pending] = useActionState<MessageState, FormData>(addPostit, null);

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-3">
      <textarea
        name="text"
        placeholder="Un mot doux, une blague, un rappel…"
        required
        rows={2}
        maxLength={280}
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-white/30 px-4 py-2 text-xs tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        {pending ? "…" : "Coller"}
      </button>
    </form>
  );
}
