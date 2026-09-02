import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile";
import { coupleConfig } from "@/lib/couple-config";
import { CycleEntryRow } from "./cycle-entry-row";
import { AddCycleEntryForm } from "./add-cycle-entry-form";
import { CycleSharingToggle } from "./cycle-sharing-toggle";

function predictNext(entries: { start_date: string }[]): string | null {
  if (entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => a.start_date.localeCompare(b.start_date));
  const last = sorted[sorted.length - 1];

  const diffs: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].start_date).getTime();
    const cur = new Date(sorted[i].start_date).getTime();
    diffs.push(Math.round((cur - prev) / 86_400_000));
  }
  const avgLength = diffs.length > 0 ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 28;

  const predicted = new Date(last.start_date);
  predicted.setDate(predicted.getDate() + Math.round(avgLength));
  return predicted.toISOString().slice(0, 10);
}

export async function CycleSection() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();

  if (profile.role === "partner") {
    const [{ data: entries, error }, { data: settings }] = await Promise.all([
      supabase.from("cycle_entries").select("id, start_date").order("start_date", { ascending: true }),
      supabase.from("cycle_settings").select("sharing_enabled").limit(1).single(),
    ]);

    const predicted = entries ? predictNext(entries) : null;

    return (
      <section className="flex min-h-screen flex-col items-center gap-8 bg-black px-6 py-24 text-white">
        <h2 className="font-serif text-2xl italic">Ton suivi</h2>
        <p className="max-w-sm text-center text-xs text-white/40">
          Visible par toi seul·e. Rien de ceci n&apos;est accessible depuis l&apos;autre
          compte, sauf si tu actives le rappel discret ci-dessous — et même
          alors, aucune date n&apos;est jamais montrée.
        </p>

        {error && (
          <p className="text-sm text-rose-300">
            Section indisponible (la migration-006 a-t-elle été exécutée ?).
          </p>
        )}

        {!error && predicted && (
          <p className="text-sm text-white/70">
            Prochaine date estimée :{" "}
            <span className="text-white">
              {new Date(predicted).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
        )}

        {entries && entries.length > 0 && (
          <ul className="flex w-full max-w-xs flex-col gap-2">
            {entries.map((e) => (
              <CycleEntryRow key={e.id} id={e.id} date={e.start_date} />
            ))}
          </ul>
        )}

        <AddCycleEntryForm />

        <CycleSharingToggle
          initialEnabled={settings?.sharing_enabled ?? false}
          authorFirstName={coupleConfig.authorFirstName}
        />
      </section>
    );
  }

  // Compte "author" : aucun accès table, seulement ce booléen dérivé.
  const { data: gentle } = await supabase.rpc("gentle_reminder_active");

  if (gentle !== true) return null;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
      <p className="max-w-sm font-hand text-2xl text-rose-200">
        Sois un peu plus attentionné avec {coupleConfig.partnerFirstName} ces prochains jours. 💛
      </p>
    </section>
  );
}
