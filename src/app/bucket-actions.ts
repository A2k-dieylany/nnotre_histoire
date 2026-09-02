"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile";

export type BucketState = { error: string } | null;

export async function addBucketItem(
  _prevState: BucketState,
  formData: FormData,
): Promise<BucketState> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  const text = formData.get("text");
  if (typeof text !== "string" || !text.trim()) {
    return { error: "La ligne ne peut pas être vide." };
  }
  if (text.length > 200) {
    return { error: "200 caractères max." };
  }

  const { error } = await supabase
    .from("bucket_items")
    .insert({ text: text.trim(), created_by: profile?.id ?? null });

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/");
  return null;
}

export async function toggleBucketItem(
  id: string,
  text: string,
  nowDone: boolean,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { error } = await supabase.from("bucket_items").update({ done: nowDone }).eq("id", id);
  if (error) {
    return { error: "La mise à jour a échoué." };
  }

  // 3E.1 : un accomplissement devient un souvenir dans la timeline — seulement
  // en cochant, jamais en décochant (l'annulation d'une case ne doit pas
  // effacer un souvenir déjà créé, elle a peut-être été cochée par erreur mais
  // le souvenir, lui, reste réel).
  if (nowDone) {
    await supabase.from("timeline_events").insert({
      title: text,
      body: "Accompli ensemble, coché sur la bucket list. ✓",
      event_date: new Date().toISOString().slice(0, 10),
    });
  }

  revalidatePath("/");
  return null;
}

export async function deleteBucketItem(id: string): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const { data: deleted, error } = await supabase
    .from("bucket_items")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !deleted || deleted.length === 0) {
    return { error: "La suppression a échoué." };
  }

  revalidatePath("/");
  return null;
}
