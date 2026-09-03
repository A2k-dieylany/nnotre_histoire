import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile";
import { coupleConfig } from "@/lib/couple-config";
import { Card } from "./card";
import { CycleEntryRow } from "./cycle-entry-row";
import { AddCycleEntryForm } from "./add-cycle-entry-form";
import { CycleSharingToggle } from "./cycle-sharing-toggle";
import { WellbeingForm } from "./wellbeing-form";
import { WellbeingEntryRow } from "./wellbeing-entry-row";

type CycleEntry = { start_date: string; end_date: string | null };

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

// Estimation obstétrique standard, pas un algorithme propriétaire : l'ovulation
// se situe en moyenne 14 jours avant les prochaines règles, quelle que soit la
// longueur du cycle. La fenêtre de fertilité entoure ce jour (les spermatozoïdes
// survivent jusqu'à ~5 jours, l'ovule environ 24h).
function computeCycleStats(entries: CycleEntry[]) {
  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => a.start_date.localeCompare(b.start_date));
  const last = sorted[sorted.length - 1];

  const lengthDiffs: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    lengthDiffs.push(daysBetween(sorted[i - 1].start_date, sorted[i].start_date));
  }
  const avgLength =
    lengthDiffs.length > 0
      ? Math.round(lengthDiffs.reduce((a, b) => a + b, 0) / lengthDiffs.length)
      : 28;

  const durations = sorted
    .filter((e) => e.end_date)
    .map((e) => daysBetween(e.start_date, e.end_date as string) + 1);
  const avgDuration =
    durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 5;

  const predictedNext = new Date(last.start_date);
  predictedNext.setDate(predictedNext.getDate() + avgLength);

  const ovulationDayIndex = Math.max(avgLength - 14, 0);
  const fertileStartIndex = Math.max(ovulationDayIndex - 5, 0);
  const fertileEndIndex = ovulationDayIndex + 1;

  const today = new Date().toISOString().slice(0, 10);
  const daysSinceLastStart = daysBetween(last.start_date, today);

  let phase: string;
  if (daysSinceLastStart < 0) {
    phase = "—";
  } else if (daysSinceLastStart < avgDuration) {
    phase = "Règles";
  } else if (daysSinceLastStart < fertileStartIndex) {
    phase = "Phase folliculaire";
  } else if (daysSinceLastStart <= fertileEndIndex) {
    phase = "Fenêtre de fertilité";
  } else {
    phase = "Phase lutéale";
  }

  const fertileStart = new Date(last.start_date);
  fertileStart.setDate(fertileStart.getDate() + fertileStartIndex);
  const fertileEnd = new Date(last.start_date);
  fertileEnd.setDate(fertileEnd.getDate() + fertileEndIndex);

  return {
    predictedNext: predictedNext.toISOString().slice(0, 10),
    avgLength,
    avgDuration,
    phase,
    fertileStart: fertileStart.toISOString().slice(0, 10),
    fertileEnd: fertileEnd.toISOString().slice(0, 10),
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

export async function CycleSection() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();

  if (profile.role === "partner") {
    const [
      { data: entries, error },
      { data: settings },
      { data: wellbeing },
    ] = await Promise.all([
      supabase
        .from("cycle_entries")
        .select("id, start_date, end_date")
        .order("start_date", { ascending: true }),
      supabase.from("cycle_settings").select("sharing_enabled").limit(1).single(),
      supabase
        .from("wellbeing_entries")
        .select("id, entry_date, mood, symptoms, note")
        .order("entry_date", { ascending: false })
        .limit(30),
    ]);

    const stats = entries ? computeCycleStats(entries) : null;

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
            Section indisponible (les migrations 006 et 007 ont-elles été exécutées ?).
          </p>
        )}

        {!error && stats && (
          <div className="flex flex-col items-center gap-1 text-sm text-white/70">
            <p>
              Phase actuelle : <span className="text-white">{stats.phase}</span>
            </p>
            <p>
              Prochaines règles estimées :{" "}
              <span className="text-white">{formatDate(stats.predictedNext)}</span>
            </p>
            <p>
              Fenêtre de fertilité estimée :{" "}
              <span className="text-white">
                {formatDate(stats.fertileStart)} – {formatDate(stats.fertileEnd)}
              </span>
            </p>
            <p className="text-xs text-white/40">
              Cycle moyen : {stats.avgLength} j · Règles moyennes : {stats.avgDuration} j
            </p>
          </div>
        )}

        {entries && entries.length > 0 && (
          <ul className="flex w-full max-w-xs flex-col gap-2">
            {entries.map((e) => (
              <CycleEntryRow key={e.id} id={e.id} date={e.start_date} />
            ))}
          </ul>
        )}

        <AddCycleEntryForm />

        <Card className="max-w-sm !p-0">
          <CycleSharingToggle
            initialEnabled={settings?.sharing_enabled ?? false}
            authorFirstName={coupleConfig.authorFirstName}
          />
        </Card>

        <div className="w-full max-w-sm border-t border-white/10 pt-8">
          <h3 className="mb-4 text-center font-serif text-lg italic">Journal du jour</h3>
          <WellbeingForm />
          {wellbeing && wellbeing.length > 0 && (
            <ul className="mt-6 flex flex-col gap-3">
              {wellbeing.map((w) => (
                <WellbeingEntryRow
                  key={w.id}
                  id={w.id}
                  date={w.entry_date}
                  mood={w.mood}
                  symptoms={w.symptoms}
                  note={w.note}
                />
              ))}
            </ul>
          )}
        </div>
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
