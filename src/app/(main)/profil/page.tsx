import { getCurrentProfile } from "@/lib/profile";
import { coupleConfig } from "@/lib/couple-config";
import { CycleSection } from "@/components/cycle-section";
import { Card } from "@/components/card";
import { signOut } from "@/app/actions";

export default async function ProfilPage() {
  const profile = await getCurrentProfile();
  const startDate = new Date(coupleConfig.startDate);
  const formattedStart = startDate.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page-fade-in flex min-h-screen flex-col items-center gap-6 bg-black px-6 py-16 text-white">
      <h1 className="font-serif text-2xl italic">Profil</h1>

      <Card className="max-w-sm text-center">
        <p className="font-serif text-lg italic">
          {coupleConfig.authorFirstName} &amp; {coupleConfig.partnerFirstName}
        </p>
        <p className="mt-1 text-sm text-white/50">Ensemble depuis le {formattedStart}</p>
        {profile && (
          <p className="mt-3 text-xs uppercase tracking-widest text-white/30">
            Connecté·e en tant que {profile.display_name}
          </p>
        )}
      </Card>

      <form action={signOut} className="w-full max-w-sm">
        <button
          type="submit"
          className="w-full rounded-full border border-white/20 py-3 text-sm tracking-wide text-white/70 transition-all duration-150 active:scale-95 hover:bg-white/10 hover:text-white"
        >
          Se déconnecter
        </button>
      </form>

      <div className="w-full border-t border-white/10 pt-4">
        <CycleSection />
      </div>
    </div>
  );
}
