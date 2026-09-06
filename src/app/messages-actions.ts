"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile";

export type MessageState = { error: string } | null;

export async function addPostit(
  _prevState: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  if (!profile) {
    return { error: "Profil introuvable — la migration des profils a-t-elle été exécutée ?" };
  }

  const text = formData.get("text");
  if (typeof text !== "string" || !text.trim()) {
    return { error: "Le mot ne peut pas être vide." };
  }
  if (text.length > 280) {
    return { error: "Un post-it, ça reste court (280 caractères max)." };
  }

  const { error } = await supabase
    .from("postits")
    .insert({ from_profile_id: profile.id, text: text.trim() });

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/moments");
  return null;
}

export async function deletePostit(id: string): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();
  if (!profile) {
    return { error: "Session expirée, reconnecte-toi." };
  }

  const { data: deleted, error } = await supabase
    .from("postits")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !deleted || deleted.length === 0) {
    return { error: "La suppression a échoué." };
  }

  revalidatePath("/moments");
  return null;
}

export async function addRandomMessage(
  _prevState: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  if (!profile) {
    return { error: "Profil introuvable — la migration des profils a-t-elle été exécutée ?" };
  }

  const text = formData.get("text");
  if (typeof text !== "string" || !text.trim()) {
    return { error: "Le message ne peut pas être vide." };
  }
  if (text.length > 500) {
    return { error: "500 caractères max." };
  }

  const { error } = await supabase
    .from("random_messages")
    .insert({ from_profile_id: profile.id, text: text.trim() });

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/moments");
  return null;
}
