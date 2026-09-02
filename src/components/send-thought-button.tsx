"use client";

import { useTransition } from "react";
import { sendThought } from "@/app/dashboard-actions";

export function SendThoughtButton() {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await sendThought();
      if (result?.error) alert(result.error);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-full border border-white/30 px-6 py-3 text-sm tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
    >
      {pending ? "…" : "❤️ Je pense à toi"}
    </button>
  );
}
