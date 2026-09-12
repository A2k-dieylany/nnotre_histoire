import { createClient } from "@/lib/supabase/server";
import { AddSurpriseForm } from "./add-surprise-form";
import { UnlockableItem } from "./unlockable-item";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export async function UnlockedMemories() {
  const supabase = await createClient();

  // RLS (unlockable_content, policy "authenticated read unlocked content") ne renvoie
  // que les lignes dont unlock_at est déjà passé — rien à filtrer côté app.
  const { data: items } = await supabase
    .from("unlockable_content")
    .select("id, title, body, media_url, unlock_at")
    .order("unlock_at", { ascending: false });

  const itemsWithUrl = await Promise.all(
    (items ?? []).map(async (item) => {
      if (!item.media_url) {
        return { ...item, signedUrl: null as string | null };
      }
      const { data: signed } = await supabase.storage
        .from("memories")
        .createSignedUrl(item.media_url, SIGNED_URL_TTL_SECONDS);
      return { ...item, signedUrl: signed?.signedUrl ?? null };
    }),
  );

  return (
    <section className="flex min-h-screen flex-col items-center gap-10 bg-blush px-6 py-24 text-wine">
      <h2 className="font-serif text-2xl italic">Des surprises</h2>

      {itemsWithUrl.length > 0 && (
        <div className="flex w-full max-w-lg flex-col gap-8">
          {itemsWithUrl.map((item) => (
            <UnlockableItem key={item.id} item={item} />
          ))}
        </div>
      )}

      <details className="w-full max-w-md">
        <summary className="cursor-pointer text-center text-xs font-semibold uppercase tracking-widest text-muted hover:text-rose-d">
          Programmer une surprise
        </summary>
        <div className="mt-4 flex justify-center">
          <AddSurpriseForm />
        </div>
      </details>
    </section>
  );
}
