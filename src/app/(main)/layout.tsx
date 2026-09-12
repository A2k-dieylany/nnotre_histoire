import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/bottom-nav";
import { EasterEggs } from "@/components/easter-eggs";
import { coupleConfig } from "@/lib/couple-config";

// Vérifié ici pour les 4 onglets à la fois : un layout englobant protège
// toutes les routes qu'il enveloppe, pas besoin de dupliquer le check dans
// chaque page — même garantie que la vérification par page d'avant.
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  // EE.5 — best-effort : une ligne par jour (upsert idempotent), jamais bloquant
  // pour la navigation si la table n'existe pas encore (migration pas exécutée).
  await supabase.from("visits").upsert(
    { profile_id: data.claims.sub, visit_date: new Date().toISOString().slice(0, 10) },
    { onConflict: "profile_id,visit_date", ignoreDuplicates: true },
  );

  return (
    <div className="relative min-h-screen pb-16">
      {children}
      <EasterEggs
        secretCodeDate={coupleConfig.restartDate}
        secretCodeMessage={coupleConfig.secretCodeMessage}
        midnightMessage={coupleConfig.midnightMessage}
        hiddenStarMessage={coupleConfig.hiddenStarMessage}
        shakeMessages={coupleConfig.shakeMessages}
      />
      <BottomNav />
    </div>
  );
}
