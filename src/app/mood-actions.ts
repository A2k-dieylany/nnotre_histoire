"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile";

export type MoodState = { error: string } | null;

const ALLOWED_EMOJIS = ["☀️", "🥰", "😌", "😤", "🫠", "🌧️"];

export async function setMood(_prevState: MoodState, formData: FormData): Promise<MoodState> {
  const profile = await getCurrentProfile();
  if (!profile) {
    return { error: "Profil introuvable — vérifie que la migration SQL a bien été exécutée." };
  }

  const emoji = formData.get("emoji");
  const note = formData.get("note");

  if (typeof emoji !== "string" || !ALLOWED_EMOJIS.includes(emoji)) {
    return { error: "Choisis une humeur dans la liste proposée." };
  }

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("moods")
    .upsert(
      {
        profile_id: profile.id,
        mood_date: today,
        emoji,
        note: typeof note === "string" && note.trim() ? note.trim().slice(0, 140) : null,
      },
      { onConflict: "profile_id,mood_date" },
    );

  if (error) {
    return { error: "L'enregistrement a échoué. Réessaie." };
  }

  revalidatePath("/");
  return null;
}
