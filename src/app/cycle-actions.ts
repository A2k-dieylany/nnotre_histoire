"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile";

export type CycleState = { error: string } | null;

async function requirePartner() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "partner") {
    return null;
  }
  return profile;
}

export async function addCycleEntry(
  _prevState: CycleState,
  formData: FormData,
): Promise<CycleState> {
  // La RLS bloquerait de toute façon un compte "author", mais on le vérifie
  // ici aussi pour renvoyer un message clair plutôt qu'une erreur SQL opaque.
  const profile = await requirePartner();
  if (!profile) {
    return { error: "Cette section est réservée à ton propre suivi." };
  }

  const startDate = formData.get("start_date");
  const endDate = formData.get("end_date");
  if (typeof startDate !== "string" || !startDate) {
    return { error: "La date de début est obligatoire." };
  }
  if (typeof endDate === "string" && endDate && endDate < startDate) {
    return { error: "La date de fin ne peut pas précéder la date de début." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("cycle_entries").insert({
    start_date: startDate,
    end_date: typeof endDate === "string" && endDate ? endDate : null,
  });

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/");
  return null;
}

export async function deleteCycleEntry(id: string): Promise<{ error: string } | null> {
  const profile = await requirePartner();
  if (!profile) {
    return { error: "Non autorisé." };
  }

  const supabase = await createClient();
  const { data: deleted, error } = await supabase
    .from("cycle_entries")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !deleted || deleted.length === 0) {
    return { error: "La suppression a échoué." };
  }

  revalidatePath("/");
  return null;
}

export async function addWellbeingEntry(
  _prevState: CycleState,
  formData: FormData,
): Promise<CycleState> {
  const profile = await requirePartner();
  if (!profile) {
    return { error: "Cette section est réservée à ton propre suivi." };
  }

  const entryDate = formData.get("entry_date");
  const mood = formData.get("mood");
  const symptoms = formData.get("symptoms");
  const note = formData.get("note");

  if (typeof entryDate !== "string" || !entryDate) {
    return { error: "La date est obligatoire." };
  }

  const supabase = await createClient();
  // upsert sur entry_date (contrainte unique) : une seule entrée par jour,
  // la ré-enregistrer le même jour met simplement à jour la précédente.
  const { error } = await supabase.from("wellbeing_entries").upsert(
    {
      entry_date: entryDate,
      mood: typeof mood === "string" && mood ? mood : null,
      symptoms: typeof symptoms === "string" && symptoms.trim() ? symptoms.trim() : null,
      note: typeof note === "string" && note.trim() ? note.trim() : null,
    },
    { onConflict: "entry_date" },
  );

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/");
  return null;
}

export async function deleteWellbeingEntry(id: string): Promise<{ error: string } | null> {
  const profile = await requirePartner();
  if (!profile) {
    return { error: "Non autorisé." };
  }

  const supabase = await createClient();
  const { data: deleted, error } = await supabase
    .from("wellbeing_entries")
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !deleted || deleted.length === 0) {
    return { error: "La suppression a échoué." };
  }

  revalidatePath("/");
  return null;
}

export async function setCycleSharing(enabled: boolean): Promise<{ error: string } | null> {
  const profile = await requirePartner();
  if (!profile) {
    return { error: "Non autorisé." };
  }

  const supabase = await createClient();
  const { data: settings } = await supabase.from("cycle_settings").select("id").limit(1).single();
  if (!settings) {
    return { error: "Réglages introuvables — la migration a-t-elle été exécutée ?" };
  }

  const { error } = await supabase
    .from("cycle_settings")
    .update({ sharing_enabled: enabled })
    .eq("id", settings.id);

  if (error) {
    return { error: "La mise à jour a échoué." };
  }

  revalidatePath("/");
  return null;
}
