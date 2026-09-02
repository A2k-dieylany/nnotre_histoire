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

  return (
    <div className="relative min-h-screen pb-16">
      {children}
      <EasterEggs
        secretCodeDate={coupleConfig.restartDate}
        secretCodeMessage={coupleConfig.secretCodeMessage}
        midnightMessage={coupleConfig.midnightMessage}
      />
      <BottomNav />
    </div>
  );
}
