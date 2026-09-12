import { createClient } from "@/lib/supabase/server";
import { AddGalleryPhotoForm } from "./add-gallery-photo-form";
import { GalleryPhoto } from "./gallery-photo";

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1h — régénérée à chaque chargement de page, pas besoin de plus long

export async function GallerySection() {
  const supabase = await createClient();
  const { data: photos, error } = await supabase
    .from("gallery_photos")
    .select("id, image_url, caption, taken_on, back_note")
    .order("taken_on", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const photosWithUrl = await Promise.all(
    (photos ?? []).map(async (photo) => {
      const { data: signed } = await supabase.storage
        .from("memories")
        .createSignedUrl(photo.image_url, SIGNED_URL_TTL_SECONDS);
      return { ...photo, signedUrl: signed?.signedUrl ?? null };
    }),
  );

  return (
    <section className="flex min-h-screen flex-col items-center gap-10 bg-blush px-6 py-24 text-wine">
      <h2 className="font-serif text-2xl italic">La galerie</h2>

      {error && (
        <p className="text-sm text-rose-d">
          La galerie n&apos;a pas pu être chargée. Réessaie plus tard.
        </p>
      )}

      {!error && photosWithUrl.length === 0 && (
        <p className="max-w-sm text-center text-sm text-muted">
          Pas encore de photo. La première trouve sa place juste en dessous.
        </p>
      )}

      {!error && photosWithUrl.length > 0 && (
        <div className="w-full max-w-lg columns-2 gap-4">
          {photosWithUrl.map((photo) => (
            <GalleryPhoto key={photo.id} photo={photo} />
          ))}
        </div>
      )}

      <details className="w-full max-w-md">
        <summary className="cursor-pointer text-center text-xs font-semibold uppercase tracking-widest text-muted hover:text-rose-d">
          Ajouter une photo
        </summary>
        <div className="mt-4 flex justify-center">
          <AddGalleryPhotoForm />
        </div>
      </details>
    </section>
  );
}
