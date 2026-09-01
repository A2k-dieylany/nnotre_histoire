import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// A recréer à chaque requête (Server Component ou Server Action) — jamais partagé entre requêtes.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component (rendu) : impossible d'écrire un cookie ici.
            // proxy.ts s'occupe du rafraîchissement de session sur chaque requête, donc sans risque.
          }
        },
      },
    },
  );
}
