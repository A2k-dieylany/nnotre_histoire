import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  role: "author" | "partner";
  display_name: string;
};

// Distingue "toi" de "elle" — sans ça, le site ne peut pas savoir qui a envoyé
// un "je pense à toi", ni (plus tard) qui a le droit de voir le suivi de cycle.
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;

  if (!userId) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, role, display_name")
    .eq("id", userId)
    .single();

  return data as Profile | null;
}
