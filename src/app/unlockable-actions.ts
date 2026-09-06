"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadImage, deleteImage } from "@/lib/upload-image";

export type AddSurpriseState = { error: string } | null;

function validateUnlockAt(unlockAt: FormDataEntryValue | null): string | null {
  if (typeof unlockAt !== "string" || !unlockAt) {
    return "La date de déverrouillage est obligatoire.";
  }
  // Comparaison de chaînes ISO (YYYY-MM-DD) : ordre lexicographique = ordre
  // chronologique, pas besoin de parser en Date pour ce format.
  const todayIso = new Date().toISOString().slice(0, 10);
  if (unlockAt <= todayIso) {
    return "La date doit être dans le futur — pas aujourd'hui, pas dans le passé.";
  }
  return null;
}

export async function addUnlockableContent(
  _prevState: AddSurpriseState,
  formData: FormData,
): Promise<AddSurpriseState> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const title = formData.get("title");
  const body = formData.get("body");
  const unlockAt = formData.get("unlock_at");
  const media = formData.get("media");

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Le titre est obligatoire." };
  }
  const dateError = validateUnlockAt(unlockAt);
  if (dateError) {
    return { error: dateError };
  }

  let kind: "letter" | "photo" | "text" = "text";
  let mediaPath: string | null = null;

  if (media instanceof File && media.size > 0) {
    const uploaded = await uploadImage(supabase, media, "unlockable");
    if (!uploaded.ok) {
      return { error: uploaded.error };
    }
    mediaPath = uploaded.path;
    kind = "photo";
  } else if (typeof body === "string" && body.trim()) {
    kind = "letter";
  }

  const { error } = await supabase.from("unlockable_content").insert({
    kind,
    title: title.trim(),
    body: typeof body === "string" ? body.trim() : null,
    media_url: mediaPath,
    unlock_at: unlockAt as string,
  });

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/moments");
  return null;
}

export async function updateUnlockableContent(
  _prevState: AddSurpriseState,
  formData: FormData,
): Promise<AddSurpriseState> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const id = formData.get("id");
  const title = formData.get("title");
  const body = formData.get("body");
  const unlockAt = formData.get("unlock_at");
  const media = formData.get("media");
  const removeMedia = formData.get("remove_media") === "on";

  if (typeof id !== "string" || !id) {
    return { error: "Surprise introuvable." };
  }
  if (typeof title !== "string" || !title.trim()) {
    return { error: "Le titre est obligatoire." };
  }
  const dateError = validateUnlockAt(unlockAt);
  if (dateError) {
    return { error: dateError };
  }

  const { data: existing } = await supabase
    .from("unlockable_content")
    .select("media_url, kind")
    .eq("id", id)
    .single();

  let mediaPath: string | null = existing?.media_url ?? null;
  let kind = existing?.kind ?? "text";

  if (media instanceof File && media.size > 0) {
    const uploaded = await uploadImage(supabase, media, "unlockable");
    if (!uploaded.ok) {
      return { error: uploaded.error };
    }
    await deleteImage(supabase, mediaPath);
    mediaPath = uploaded.path;
    kind = "photo";
  } else if (removeMedia) {
    await deleteImage(supabase, mediaPath);
    mediaPath = null;
    kind = typeof body === "string" && body.trim() ? "letter" : "text";
  }

  const { error } = await supabase
    .from("unlockable_content")
    .update({
      kind,
      title: title.trim(),
      body: typeof body === "string" ? body.trim() : null,
      media_url: mediaPath,
      unlock_at: unlockAt as string,
    })
    .eq("id", id);

  if (error) {
    return { error: "La modification a échoué. Réessaie." };
  }

  revalidatePath("/moments");
  return null;
}

export async function deleteUnlockableContent(id: string): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const { data: existing } = await supabase
    .from("unlockable_content")
    .select("media_url")
    .eq("id", id)
    .single();

  // .select() après delete : voir le commentaire équivalent dans timeline-actions.ts
  // — sans lui, un blocage RLS silencieux passerait pour un succès.
  const { data: deleted, error } = await supabase
    .from("unlockable_content")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !deleted || deleted.length === 0) {
    return { error: "La suppression a échoué (droits insuffisants ?)." };
  }

  await deleteImage(supabase, existing?.media_url ?? null);

  revalidatePath("/moments");
  return null;
}
