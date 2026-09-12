"use client";

import { useActionState } from "react";
import { setMood, type MoodState } from "@/app/mood-actions";

const EMOJIS = ["☀️", "🥰", "😌", "😤", "🫠", "🌧️"];

export function MoodPickerForm({ currentEmoji }: { currentEmoji: string | null }) {
  const [state, action, pending] = useActionState<MoodState, FormData>(setMood, null);

  return (
    <form action={action} className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-rose">
        {currentEmoji ? "Changer ton humeur du jour" : "Comment tu te sens aujourd'hui ?"}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="submit"
            name="emoji"
            value={emoji}
            disabled={pending}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition active:scale-90 disabled:opacity-50 ${
              currentEmoji === emoji ? "bg-rose/20" : "bg-cream-2 hover:bg-rose/10"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <input
        type="text"
        name="note"
        placeholder="Un petit mot (optionnel)"
        maxLength={140}
        className="w-full max-w-[220px] rounded-md border border-line bg-transparent px-3 py-1.5 text-center text-xs text-wine placeholder:text-muted/60 focus:border-rose focus:outline-none"
      />
      {state?.error && <p className="text-xs text-rose-d">{state.error}</p>}
    </form>
  );
}
