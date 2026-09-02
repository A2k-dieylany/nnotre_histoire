"use client";

import { useTransition } from "react";
import { deleteCycleEntry } from "@/app/cycle-actions";

export function CycleEntryRow({ id, date }: { id: string; date: string }) {
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    startDelete(async () => {
      const result = await deleteCycleEntry(id);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <li className="flex items-center justify-between text-sm text-white/70">
      <span>
        {new Date(date).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-xs text-white/30 underline-offset-2 hover:text-rose-300 hover:underline disabled:opacity-50"
      >
        {isDeleting ? "…" : "retirer"}
      </button>
    </li>
  );
}
