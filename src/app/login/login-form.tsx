"use client";

import { useActionState } from "react";
import { signIn } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="flex w-full max-w-xs flex-col gap-4">
      <input
        type="email"
        name="email"
        placeholder="Ton email"
        required
        autoComplete="email"
        className="rounded-md border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      <input
        type="password"
        name="password"
        placeholder="Le mot secret"
        required
        autoComplete="current-password"
        className="rounded-md border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
      />
      {state?.error && (
        <p className="text-sm text-rose-300">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-white/30 py-3 text-sm tracking-wide text-white transition hover:bg-white/10 disabled:opacity-50"
      >
        {pending ? "…" : "Entrer"}
      </button>
    </form>
  );
}
