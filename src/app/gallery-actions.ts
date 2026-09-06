"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload-image";

export type GalleryState = { error: string } | null;

export async function addGalleryPhoto(
  _prevState: GalleryState,
  formData: FormData,
): Promise<GalleryState> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const photo = formData.get("photo");
  const caption = formData.get("caption");
  const takenOn = formData.get("taken_on");
  const backNote = formData.get("back_note");

  if (!(photo instanceof File) || photo.size === 0) {
    return { error: "Une photo est obligatoire." };
  }

  const uploaded = await uploadImage(supabase, photo, "gallery");
  if (!uploaded.ok) {
    return { error: uploaded.error };
  }

  const { error } = await supabase.from("gallery_photos").insert({
    image_url: uploaded.path,
    caption: typeof caption === "string" && caption.trim() ? caption.trim() : null,
    taken_on: typeof takenOn === "string" && takenOn ? takenOn : null,
    back_note: typeof backNote === "string" && backNote.trim() ? backNote.trim() : null,
  });

  if (error) {
    await deleteImage(supabase, uploaded.path);
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/moments");
  return null;
}

export async function updateGalleryCaption(
  _prevState: GalleryState,
  formData: FormData,
): Promise<GalleryState> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const id = formData.get("id");
  const caption = formData.get("caption");
  const takenOn = formData.get("taken_on");
  const backNote = formData.get("back_note");

  if (typeof id !== "string" || !id) {
    return { error: "Photo introuvable." };
  }

  const { error } = await supabase
    .from("gallery_photos")
    .update({
      caption: typeof caption === "string" && caption.trim() ? caption.trim() : null,
      taken_on: typeof takenOn === "string" && takenOn ? takenOn : null,
      back_note: typeof backNote === "string" && backNote.trim() ? backNote.trim() : null,
    })
    .eq("id", id);

  if (error) {
    return { error: "La modification a échoué. Réessaie." };
  }

  revalidatePath("/moments");
  return null;
}

export async function deleteGalleryPhoto(id: string): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const { data: existing } = await supabase
    .from("gallery_photos")
    .select("image_url")
    .eq("id", id)
    .single();

  // .select() après delete : si la RLS bloque silencieusement (policy manquante),
  // delete() ne renvoie pas d'erreur mais affecte 0 ligne — voir timeline-actions.ts.
  const { data: deleted, error } = await supabase
    .from("gallery_photos")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !deleted || deleted.length === 0) {
    return { error: "La suppression a échoué (droits insuffisants ?)." };
  }

  await deleteImage(supabase, existing?.image_url ?? null);

  revalidatePath("/moments");
  return null;
}
