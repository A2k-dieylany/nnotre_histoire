"use client";

import { useTransition } from "react";
import { deleteWellbeingEntry } from "@/app/cycle-actions";

export function WellbeingEntryRow({
  id,
  date,
  mood,
  symptoms,
  note,
}: {
  id: string;
  date: string;
  mood: string | null;
  symptoms: string | null;
  note: string | null;
}) {
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteWellbeingEntry(id);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <li className="flex items-start justify-between gap-3 text-sm text-white/70">
      <div>
        <span className="text-white/40">
          {new Date(date).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}
        </span>{" "}
        {mood && <span>{mood}</span>}
        {symptoms && <span className="text-white/50"> · {symptoms}</span>}
        {note && <p className="mt-0.5 text-xs text-white/40">{note}</p>}
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="shrink-0 text-xs text-white/30 underline-offset-2 hover:text-rose-300 hover:underline disabled:opacity-50"
      >
        {isDeleting ? "…" : "retirer"}
      </button>
    </li>
  );
}
