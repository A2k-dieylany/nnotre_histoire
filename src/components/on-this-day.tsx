import { createClient } from "@/lib/supabase/server";
import { Card } from "./card";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function monthDay(iso: string) {
  return iso.slice(5, 10); // "YYYY-MM-DD" -> "MM-DD"
}

function yearsAgo(iso: string) {
  return new Date().getFullYear() - Number(iso.slice(0, 4));
}

// 3C.3 — "Il y a X ans aujourd'hui". Deux tables, deux dates différentes
// (event_date / taken_on) : filtré en mémoire plutôt qu'en SQL — le volume
// d'un couple (dizaines/centaines de lignes) ne justifie pas une fonction dédiée.
export async function OnThisDay() {
  const supabase = await createClient();
  const today = monthDay(new Date().toISOString());

  const [{ data: events }, { data: photos }] = await Promise.all([
    supabase.from("timeline_events").select("id, title, event_date, cover_image_url"),
    supabase.from("gallery_photos").select("id, caption, taken_on, image_url").not("taken_on", "is", null),
  ]);

  const matchingEvents = (events ?? []).filter(
    (e) => monthDay(e.event_date) === today && yearsAgo(e.event_date) > 0,
  );
  const matchingPhotos = (photos ?? []).filter(
    (p) => p.taken_on && monthDay(p.taken_on) === today && yearsAgo(p.taken_on) > 0,
  );

  if (matchingEvents.length === 0 && matchingPhotos.length === 0) {
    return null;
  }

  const eventsWithUrl = await Promise.all(
    matchingEvents.map(async (e) => {
      if (!e.cover_image_url) return { ...e, signedUrl: null as string | null };
      const { data: signed } = await supabase.storage
        .from("memories")
        .createSignedUrl(e.cover_image_url, SIGNED_URL_TTL_SECONDS);
      return { ...e, signedUrl: signed?.signedUrl ?? null };
    }),
  );

  const photosWithUrl = await Promise.all(
    matchingPhotos.map(async (p) => {
      const { data: signed } = await supabase.storage
        .from("memories")
        .createSignedUrl(p.image_url, SIGNED_URL_TTL_SECONDS);
      return { ...p, signedUrl: signed?.signedUrl ?? null };
    }),
  );

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-rose">Il y a ce jour-là</p>

      {eventsWithUrl.map((e) => (
        <div key={e.id} className="flex flex-col items-center gap-2">
          {e.signedUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- URL signée éphémère
            <img src={e.signedUrl} alt="" className="max-h-48 w-full rounded-md object-cover" />
          )}
          <p className="font-hand text-xl text-rose-d">
            Il y a {yearsAgo(e.event_date)} an{yearsAgo(e.event_date) > 1 ? "s" : ""} : {e.title}
          </p>
        </div>
      ))}

      {photosWithUrl.map((p) => (
        <div key={p.id} className="flex flex-col items-center gap-2">
          {p.signedUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- URL signée éphémère
            <img src={p.signedUrl} alt="" className="max-h-48 w-full rounded-md object-cover" />
          )}
          <p className="font-hand text-xl text-rose-d">
            Il y a {yearsAgo(p.taken_on as string)} an{yearsAgo(p.taken_on as string) > 1 ? "s" : ""} jour pour jour
            {p.caption ? ` : ${p.caption}` : ""}
          </p>
        </div>
      ))}
    </Card>
  );
}
