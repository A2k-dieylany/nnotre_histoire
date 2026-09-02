"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile";

export async function sendThought(): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  if (!profile) {
    return { error: "Profil introuvable — vérifie que la migration SQL a bien été exécutée." };
  }

  const { error } = await supabase.from("thoughts").insert({ from_profile_id: profile.id });

  if (error) {
    return { error: "L'envoi a échoué. Réessaie." };
  }

  revalidatePath("/");
  return null;
}
