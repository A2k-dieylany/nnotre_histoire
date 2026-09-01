"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
    // Vérif MIME serveur minimale : suffisant pour un upload à deux utilisateurs
    // authentifiés (pas un formulaire public), pas une inspection des octets magiques.
    if (!cover.type.startsWith("image/")) {
      return { error: "Le fichier doit être une image." };
    }
    if (cover.size > 8 * 1024 * 1024) {
      return { error: "L'image est trop lourde (8 Mo max)." };
    }

    const extension = cover.name.split(".").pop()?.toLowerCase() || "jpg";
    // Nom regénéré, jamais le nom d'origine : évite les collisions et les noms de fichier hostiles.
    const path = `timeline/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("memories")
      .upload(path, cover, { contentType: cover.type });

    if (uploadError) {
      return { error: "L'envoi de la photo a échoué. Réessaie." };
    }
    coverPath = path;
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
