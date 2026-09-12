import { Bell, LogOut, Moon } from "lucide-react";
import { getCurrentProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { coupleConfig } from "@/lib/couple-config";
import { CycleSection } from "@/components/cycle-section";
import { Card } from "@/components/card";
import { SettingsRow } from "@/components/settings-row";
import { signOut } from "@/app/actions";

export default async function ProfilPage() {
  const profile = await getCurrentProfile();
  const startDate = new Date(coupleConfig.startDate);
  const formattedStart = startDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // EE.5 — discret, pas un chiffre affiché avant qu'il ait du sens (1 visite
  // le jour même serait bizarre à annoncer).
  let visitCount: number | null = null;
  if (profile) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("visits")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id);
    visitCount = count ?? null;
  }

  return (
    <div className="page-fade-in flex min-h-screen flex-col items-center gap-6 bg-blush px-6 py-16 text-wine">
      <h1 className="font-serif text-2xl italic">Profil</h1>

      <Card className="max-w-sm text-center">
        <p className="font-serif text-lg italic">
          {coupleConfig.authorFirstName} &amp; {coupleConfig.partnerFirstName}
        </p>
        <p className="mt-1 text-sm text-muted">Ensemble depuis le {formattedStart}</p>
        {profile && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-rose">
            Connecté·e en tant que {profile.display_name}
          </p>
        )}
        {visitCount !== null && visitCount >= 2 && (
          <p className="mt-2 text-xs text-muted/70">
            Tu es revenu·e {visitCount} fois sur ce site. Ça veut dire que ça t&apos;a plu. 😏
          </p>
        )}
      </Card>

      <Card className="max-w-sm !p-0 divide-y divide-line">
        <SettingsRow
          icon={Bell}
          iconBg="bg-cream-2"
          iconColor="text-rose-d"
          title="Notifications"
          subtitle="Bientôt disponible"
          right={
            <span className="shrink-0 rounded-full bg-cream-2 px-2.5 py-1 text-[11px] font-medium text-muted">
              Bientôt
            </span>
          }
        />
        <SettingsRow
          icon={Moon}
          iconBg="bg-cream-2"
          iconColor="text-rose-d"
          title="Thème"
          subtitle="Notre Univers est pensé pour la douceur"
          right={
            <span className="shrink-0 rounded-full bg-cream-2 px-2.5 py-1 text-[11px] font-medium text-muted">
              Clair
            </span>
          }
        />
        <form action={signOut}>
          <button type="submit" className="w-full text-left transition-transform duration-150 active:scale-[0.98]">
            <SettingsRow
              icon={LogOut}
              iconBg="bg-rose/10"
              iconColor="text-rose-d"
              title="Se déconnecter"
            />
          </button>
        </form>
      </Card>

      <div className="w-full border-t border-line pt-4">
        <CycleSection />
      </div>
    </div>
  );
}
