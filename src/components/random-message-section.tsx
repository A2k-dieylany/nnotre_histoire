import { createClient } from "@/lib/supabase/server";
import { RandomMessageButton } from "./random-message-button";
import { AddRandomMessageForm } from "./add-random-message-form";

export async function RandomMessageSection() {
  const supabase = await createClient();
  const { data } = await supabase.from("random_messages").select("text");
  const pool = (data ?? []).map((m) => m.text);

  return (
    <section className="flex min-h-screen flex-col items-center gap-10 bg-blush px-6 py-24 text-wine">
      <h2 className="font-serif text-2xl italic">Dis-moi quelque chose de beau</h2>

      <RandomMessageButton pool={pool} />

      <details className="w-full max-w-sm">
        <summary className="cursor-pointer text-center text-xs font-semibold uppercase tracking-widest text-muted hover:text-rose-d">
          Ajouter un message au tiroir
        </summary>
        <div className="mt-4 flex justify-center">
          <AddRandomMessageForm />
        </div>
      </details>
    </section>
  );
}
