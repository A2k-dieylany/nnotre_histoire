"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AddSurpriseState = { error: string } | null;

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
  if (typeof unlockAt !== "string" || !unlockAt) {
    return { error: "La date de déverrouillage est obligatoire." };
  }
  // Comparaison de chaînes ISO (YYYY-MM-DD) : ordre lexicographique = ordre
  // chronologique, pas besoin de parser en Date pour ce format.
  const todayIso = new Date().toISOString().slice(0, 10);
  if (unlockAt <= todayIso) {
    return { error: "La date doit être dans le futur — pas aujourd'hui, pas dans le passé." };
  }

  let kind: "letter" | "photo" | "text" = "text";
  let mediaPath: string | null = null;

  if (media instanceof File && media.size > 0) {
    if (!media.type.startsWith("image/")) {
      return { error: "Le fichier doit être une image." };
    }
    if (media.size > 8 * 1024 * 1024) {
      return { error: "L'image est trop lourde (8 Mo max)." };
    }

    const extension = media.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `unlockable/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("memories")
      .upload(path, media, { contentType: media.type });

    if (uploadError) {
      return { error: "L'envoi de l'image a échoué. Réessaie." };
    }
    mediaPath = path;
    kind = "photo";
  } else if (typeof body === "string" && body.trim()) {
    kind = "letter";
  }

  const { error } = await supabase.from("unlockable_content").insert({
    kind,
    title: title.trim(),
    body: typeof body === "string" ? body.trim() : null,
    media_url: mediaPath,
    unlock_at: unlockAt,
  });

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/");
  return null;
}
