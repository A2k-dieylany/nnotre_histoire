"use client";

import { useTransition } from "react";
import { deletePostit } from "@/app/messages-actions";

const COLORS: Record<string, string> = {
  author: "bg-amber-100 text-amber-950",
  partner: "bg-rose-100 text-rose-950",
};

export function PostitCard({
  id,
  text,
  authorName,
  authorRole,
}: {
  id: string;
  text: string;
  authorName: string;
  authorRole: string;
}) {
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    if (!confirm("Retirer ce post-it ?")) return;
    startDelete(async () => {
      const result = await deletePostit(id);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <div
      className={`relative flex min-h-32 -rotate-1 flex-col justify-between rounded-sm p-4 shadow-lg transition hover:rotate-0 ${COLORS[authorRole] ?? "bg-yellow-100 text-yellow-950"}`}
    >
      <p className="font-hand text-lg leading-snug">{text}</p>
      <div className="mt-2 flex items-center justify-between text-xs opacity-60">
        <span>— {authorName}</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="underline-offset-2 hover:underline disabled:opacity-50"
        >
          {isDeleting ? "…" : "retirer"}
        </button>
      </div>
    </div>
  );
}
