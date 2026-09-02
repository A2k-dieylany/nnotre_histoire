import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { OpeningSequence } from "@/components/opening-sequence";
import { Dashboard } from "@/components/dashboard";
import { PostitsWall } from "@/components/postits-wall";
import { RandomMessageSection } from "@/components/random-message-section";
import { Timeline } from "@/components/timeline";
import { TheLetter } from "@/components/the-letter";
import { EasterEggs } from "@/components/easter-eggs";
import { UnlockedMemories } from "@/components/unlocked-memories";
import { coupleConfig } from "@/lib/couple-config";

export default async function Home() {
  // Vérifié ici aussi, pas seulement dans proxy.ts : un Server Component est atteignable
  // directement, et un changement de matcher dans le proxy ne doit pas suffire à exposer cette page.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  return (
    <div className="relative">
      <OpeningSequence
        startDate={coupleConfig.startDate}
        partnerFirstName={coupleConfig.partnerFirstName}
        songUrl={coupleConfig.songUrl ?? undefined}
      />
      <Dashboard />
      <PostitsWall />
      <RandomMessageSection />
      <Timeline />
      <TheLetter
        body={coupleConfig.letterBody}
        closing={coupleConfig.letterClosing}
        authorFirstName={coupleConfig.authorFirstName}
        signatureImageUrl={coupleConfig.signatureImageUrl}
      />
      <UnlockedMemories />
      <EasterEggs
        secretCodeDate={coupleConfig.restartDate}
        secretCodeMessage={coupleConfig.secretCodeMessage}
        midnightMessage={coupleConfig.midnightMessage}
      />
      <form action={signOut} className="fixed right-4 top-4 z-10">
        <button
          type="submit"
          className="rounded-md border border-white/20 px-3 py-1.5 text-xs tracking-wide text-white/50 transition hover:bg-white/10 hover:text-white/80"
        >
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
