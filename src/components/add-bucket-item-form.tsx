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
          className="flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm text-wine placeholder:text-muted/60 focus:border-rose focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-rose px-4 py-2 text-xs font-semibold tracking-wide text-white transition active:scale-95 hover:bg-rose-d disabled:opacity-50"
        >
          {pending ? "…" : "Ajouter"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-rose-d">{state.error}</p>}
    </form>
  );
}
