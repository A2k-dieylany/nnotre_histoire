"use client";

import { useActionState, useState } from "react";
import { addTimelineEvent } from "@/app/timeline-actions";

const MAX_COVER_BYTES = 8 * 1024 * 1024;

export function AddMemoryForm() {
  const [state, action, pending] = useActionState(addTimelineEvent, null);
  const [clientError, setClientError] = useState<string | null>(null);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_COVER_BYTES) {
      setClientError("L'image est trop lourde (8 Mo max).");
      e.target.value = "";
    } else {
      setClientError(null);
    }
  }

  return (
    <form action={action} className="flex w-full max-w-md flex-col gap-3">
      <input
        type="text"
        name="title"
        placeholder="Titre du souvenir"
        required
        maxLength={120}
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <input
        type="date"
        name="event_date"
        required
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-white/50 focus:outline-none"
      />
      <textarea
        name="body"
        placeholder="L'anecdote…"
        rows={3}
        maxLength={2000}
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <textarea
        name="secret_note"
        placeholder="Anecdote cachée (optionnelle) — révélée par un ✨ cliquable"
        rows={2}
        maxLength={1000}
        className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <input
        type="file"
        name="cover"
        accept="image/*"
        onChange={handleCoverChange}
        className="text-xs text-white/60 file:mr-3 file:rounded-md file:border file:border-white/20 file:bg-transparent file:px-3 file:py-1.5 file:text-xs file:text-white"
      />
      {(clientError || state?.error) && (
        <p className="text-sm text-rose-300">{clientError ?? state?.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-white/30 px-4 py-2 text-xs tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        {pending ? "…" : "Ajouter à la timeline"}
      </button>
    </form>
  );
}
