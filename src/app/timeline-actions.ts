"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload-image";

export type AddEventState = { error: string } | null;

export async function addTimelineEvent(
  _prevState: AddEventState,
  formData: FormData,
): Promise<AddEventState> {
  const supabase = await createClient();

  // Vérifié ici, pas seulement via le proxy : un Server Function est atteignable
  // par POST direct, avec ou sans passer par la page.
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const title = formData.get("title");
  const body = formData.get("body");
  const eventDate = formData.get("event_date");
  const cover = formData.get("cover");

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Le titre est obligatoire." };
  }
  if (typeof eventDate !== "string" || !eventDate) {
    return { error: "La date est obligatoire." };
  }

  // cover_image_url stocke en réalité un CHEMIN dans le bucket privé "memories",
  // pas une URL — le bucket n'a pas d'accès public, l'URL signée se génère à
  // l'affichage (voir timeline.tsx). Le nom de colonne est trompeur mais renommer
  // demanderait une migration de plus pour un projet à deux personnes ; pas prioritaire.
  let coverPath: string | null = null;

  if (cover instanceof File && cover.size > 0) {
    const uploaded = await uploadImage(supabase, cover, "timeline");
    if (!uploaded.ok) {
      return { error: uploaded.error };
    }
    coverPath = uploaded.path;
  }

  const { error } = await supabase.from("timeline_events").insert({
    title: title.trim(),
    body: typeof body === "string" ? body.trim() : "",
    event_date: eventDate,
    cover_image_url: coverPath,
  });

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/");
  return null;
}

export async function updateTimelineEvent(
  _prevState: AddEventState,
  formData: FormData,
): Promise<AddEventState> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const id = formData.get("id");
  const title = formData.get("title");
  const body = formData.get("body");
  const eventDate = formData.get("event_date");
  const cover = formData.get("cover");
  const removeCover = formData.get("remove_cover") === "on";

  if (typeof id !== "string" || !id) {
    return { error: "Souvenir introuvable." };
  }
  if (typeof title !== "string" || !title.trim()) {
    return { error: "Le titre est obligatoire." };
  }
  if (typeof eventDate !== "string" || !eventDate) {
    return { error: "La date est obligatoire." };
  }

  const { data: existing } = await supabase
    .from("timeline_events")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  let coverPath: string | null = existing?.cover_image_url ?? null;

  if (cover instanceof File && cover.size > 0) {
    const uploaded = await uploadImage(supabase, cover, "timeline");
    if (!uploaded.ok) {
      return { error: uploaded.error };
    }
    await deleteImage(supabase, coverPath);
    coverPath = uploaded.path;
  } else if (removeCover) {
    await deleteImage(supabase, coverPath);
    coverPath = null;
  }

  const { error } = await supabase
    .from("timeline_events")
    .update({
      title: title.trim(),
      body: typeof body === "string" ? body.trim() : "",
      event_date: eventDate,
      cover_image_url: coverPath,
    })
    .eq("id", id);

  if (error) {
    return { error: "La modification a échoué. Réessaie." };
  }

  revalidatePath("/");
  return null;
}

export async function deleteTimelineEvent(id: string): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const { data: existing } = await supabase
    .from("timeline_events")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  // .select() après delete renvoie les lignes effectivement supprimées : si la
  // RLS bloque silencieusement (policy manquante), delete() ne renvoie pas
  // d'erreur mais affecte 0 ligne — sans ce .select(), l'échec passerait inaperçu.
  const { data: deleted, error } = await supabase
    .from("timeline_events")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !deleted || deleted.length === 0) {
    return { error: "La suppression a échoué (droits insuffisants ?)." };
  }

  await deleteImage(supabase, existing?.cover_image_url ?? null);

  revalidatePath("/");
  return null;
}
