import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_BYTES = 8 * 1024 * 1024;

export type UploadImageResult = { ok: true; path: string } | { ok: false; error: string };

// Réutilisé par timeline et unlockable_content : mêmes règles d'upload
// (voir §4 de la ligne de base sécurité — type MIME serveur, taille, nom regénéré).
export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  folder: string,
): Promise<UploadImageResult> {
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Le fichier doit être une image." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "L'image est trop lourde (8 Mo max)." };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("memories")
    .upload(path, file, { contentType: file.type });

  if (error) {
    return { ok: false, error: "L'envoi de l'image a échoué. Réessaie." };
  }

  return { ok: true, path };
}

// Best-effort : si la suppression échoue (fichier déjà absent, erreur réseau…),
// on ne bloque pas l'opération principale pour un fichier orphelin.
export async function deleteImage(supabase: SupabaseClient, path: string | null) {
  if (!path) return;
  try {
    await supabase.storage.from("memories").remove([path]);
  } catch {
    // Nettoyage secondaire : une image orpheline dans le bucket n'est pas grave.
  }
}
