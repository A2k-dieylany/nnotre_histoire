import { createClient } from "@/lib/supabase/server";
import { AddMemoryForm } from "./add-memory-form";
import { TimelineItem } from "./timeline-item";

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1h — régénérée à chaque chargement de page, pas besoin de plus long

export async function Timeline() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("timeline_events")
    .select("id, title, body, event_date, cover_image_url")
    .order("event_date", { ascending: true });

  // cover_image_url contient un chemin dans le bucket privé, pas une URL utilisable
  // telle quelle : on résout une URL signée temporaire pour chaque photo présente.
  const eventsWithCoverUrl = await Promise.all(
    (events ?? []).map(async (event) => {
      if (!event.cover_image_url) {
        return { ...event, coverSignedUrl: null as string | null };
      }
      const { data: signed } = await supabase.storage
        .from("memories")
        .createSignedUrl(event.cover_image_url, SIGNED_URL_TTL_SECONDS);
      return { ...event, coverSignedUrl: signed?.signedUrl ?? null };
    }),
  );

  return (
    <section className="flex min-h-screen flex-col items-center gap-10 bg-black px-6 py-24 text-white">
      <h2 className="font-serif text-2xl italic">Notre voyage</h2>

      {error && (
        <p className="text-sm text-rose-300">
          Les souvenirs n&apos;ont pas pu être chargés. Réessaie plus tard.
        </p>
      )}

      {!error && eventsWithCoverUrl.length === 0 && (
        <p className="max-w-sm text-center text-sm text-white/50">
          Pas encore de souvenir ajouté. Le premier commence juste en dessous.
        </p>
      )}

      {!error && eventsWithCoverUrl.length > 0 && (
        <ol className="flex w-full max-w-lg flex-col gap-8 border-l border-white/15 pl-6">
          {eventsWithCoverUrl.map((event) => (
            <TimelineItem key={event.id} event={event} />
          ))}
        </ol>
      )}

      <details className="w-full max-w-md">
        <summary className="cursor-pointer text-center text-xs uppercase tracking-widest text-white/40 hover:text-white/70">
          Ajouter un souvenir
        </summary>
        <div className="mt-4 flex justify-center">
          <AddMemoryForm />
        </div>
      </details>
    </section>
  );
}
