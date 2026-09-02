"use client";

import { useActionState } from "react";
import { addBucketItem, type BucketState } from "@/app/bucket-actions";

export function AddBucketItemForm() {
  const [state, action, pending] = useActionState<BucketState, FormData>(addBucketItem, null);

  return (
    <form action={action} className="flex w-full max-w-md flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          name="text"
          placeholder="Quelque chose à faire ensemble…"
          required
          maxLength={200}
          className="flex-1 rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-md border border-white/30 px-4 py-2 text-xs tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
        >
          {pending ? "…" : "Ajouter"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
    </form>
  );
}
