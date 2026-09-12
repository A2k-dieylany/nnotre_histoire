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
        className="rounded-md border border-line bg-white px-3 py-2 text-sm text-wine placeholder:text-muted/60 focus:border-rose focus:outline-none"
      />
      {state?.error && <p className="text-sm text-rose-d">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-rose px-4 py-2 text-xs font-semibold tracking-wide text-white transition active:scale-95 hover:bg-rose-d disabled:opacity-50"
      >
        {pending ? "…" : "Coller"}
      </button>
    </form>
  );
}
