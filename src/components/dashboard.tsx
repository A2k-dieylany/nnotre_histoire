import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentProfile, type Profile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { coupleConfig } from "@/lib/couple-config";
import { LiveCounter } from "./live-counter";
import { DailyQuote } from "./daily-quote";
import { Countdown } from "./countdown";
import { SendThoughtButton } from "./send-thought-button";

const THOUGHT_FRESHNESS_MS = 24 * 60 * 60 * 1000; // au-delà, la notif n'a plus grand sens

// Fonction normale (pas un composant) : Date.now() y est autorisé. Le linter
// interdit les appels impurs dans le corps d'un composant/hook, pas ici.
async function wasThoughtReceivedRecently(supabase: SupabaseClient, profile: Profile) {
  const { data: lastThought } = await supabase
    .from("thoughts")
    .select("from_profile_id, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastThought || lastThought.from_profile_id === profile.id) {
    return false;
  }

  return Date.now() - new Date(lastThought.created_at).getTime() < THOUGHT_FRESHNESS_MS;
}

export async function Dashboard() {
  const profile = await getCurrentProfile();

  // Pas de profil = la migration-003 n'a pas (encore) été exécutée, ou le compte
  // connecté n'a pas été rattaché. On le dit clairement plutôt que de planter.
  if (!profile) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <p className="max-w-sm text-sm text-white/50">
          Le tableau de bord n&apos;est pas encore actif — la migration SQL des
          profils (migration-003-profiles.sql) doit être exécutée, avec les deux
          comptes reliés.
        </p>
      </section>
    );
  }

  const supabase = await createClient();
  const receivedRecently = await wasThoughtReceivedRecently(supabase, profile);

  const otherName =
    profile.role === "author" ? coupleConfig.partnerFirstName : coupleConfig.authorFirstName;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-10 bg-black px-6 py-24 text-white">
      <h2 className="font-serif text-2xl italic">Notre quotidien</h2>

      <LiveCounter startDate={coupleConfig.startDate} />

      {receivedRecently && (
        <p className="font-hand text-2xl text-rose-200">
          {otherName} pense à toi en ce moment. ❤️
        </p>
      )}

      <DailyQuote quotes={coupleConfig.dailyQuotes} />

      {coupleConfig.nextEvent.date && (
        <Countdown label={coupleConfig.nextEvent.label} date={coupleConfig.nextEvent.date} />
      )}

      <SendThoughtButton />
    </section>
  );
}
