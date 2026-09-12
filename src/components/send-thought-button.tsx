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
      className="rounded-full bg-rose px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-[0_6px_16px_rgba(232,70,110,0.35)] transition active:scale-95 hover:bg-rose-d disabled:opacity-50"
    >
      {pending ? "…" : "❤️ Je pense à toi"}
    </button>
  );
}
