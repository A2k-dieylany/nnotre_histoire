import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function Home() {
  // Vérifié ici aussi, pas seulement dans proxy.ts : un Server Component est atteignable
  // directement, et un changement de matcher dans le proxy ne doit pas suffire à exposer cette page.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black text-center text-white">
      <p className="font-serif text-2xl italic">Bienvenue.</p>
      <p className="max-w-sm text-sm text-white/60">
        La suite (compteur, timeline, la lettre) arrive ici. L&apos;authentification
        est fonctionnelle de bout en bout.
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md border border-white/20 px-4 py-2 text-xs tracking-wide text-white/70 transition hover:bg-white/10"
        >
          Se déconnecter
        </button>
      </form>
    </main>
  );
}
