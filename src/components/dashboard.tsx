import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentProfile, type Profile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { coupleConfig } from "@/lib/couple-config";
import { Card } from "./card";
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
      <section className="flex flex-col items-center gap-4 bg-black px-6 py-16 text-center text-white">
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
    <section className="flex flex-col items-center gap-5 bg-black px-6 pb-16 pt-4 text-white">
      <Card className="flex flex-col items-center gap-4 text-center">
        {receivedRecently && (
          <p className="font-hand text-2xl text-rose-200">
            {otherName} pense à toi en ce moment. ❤️
          </p>
        )}
        <SendThoughtButton />
      </Card>

      <Card className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs uppercase tracking-widest text-white/30">Citation du jour</p>
        <DailyQuote quotes={coupleConfig.dailyQuotes} />
      </Card>

      {coupleConfig.nextEvent.date && (
        <Card className="text-center">
          <Countdown label={coupleConfig.nextEvent.label} date={coupleConfig.nextEvent.date} />
        </Card>
      )}
    </section>
  );
}
