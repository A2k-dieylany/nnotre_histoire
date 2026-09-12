import { createClient } from "@/lib/supabase/server";
import { PostitCard } from "./postit-card";
import { AddPostitForm } from "./add-postit-form";

export async function PostitsWall() {
  const supabase = await createClient();
  // Deux requêtes plutôt qu'un embed profiles(...) : sans types Supabase générés,
  // le client ne sait pas que la relation est "un seul" et type le join en
  // tableau alors que le runtime renvoie un objet — source d'erreurs de type
  // évitable en restant simple.
  const [{ data: postits, error }, { data: profiles }] = await Promise.all([
    supabase
      .from("postits")
      .select("id, text, from_profile_id")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, display_name, role"),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <section className="flex min-h-screen flex-col items-center gap-10 bg-blush px-6 py-24 text-wine">
      <h2 className="font-serif text-2xl italic">Le mur</h2>

      {error && (
        <p className="text-sm text-rose-d">
          Le mur n&apos;a pas pu être chargé (la migration-004 a-t-elle été exécutée ?).
        </p>
      )}

      {!error && postits && postits.length === 0 && (
        <p className="max-w-sm text-center text-sm text-muted">
          Le mur est vide. Colle le premier mot en dessous.
        </p>
      )}

      {!error && postits && postits.length > 0 && (
        <div className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
          {postits.map((p) => (
            <PostitCard
              key={p.id}
              id={p.id}
              text={p.text}
              authorName={profileById.get(p.from_profile_id)?.display_name ?? "?"}
              authorRole={profileById.get(p.from_profile_id)?.role ?? ""}
            />
          ))}
        </div>
      )}

      <AddPostitForm />
    </section>
  );
}
