import { OpeningSequence } from "@/components/opening-sequence";
import { Dashboard } from "@/components/dashboard";
import { coupleConfig } from "@/lib/couple-config";

export default function AccueilPage() {
  return (
    <>
      <OpeningSequence
        startDate={coupleConfig.startDate}
        partnerFirstName={coupleConfig.partnerFirstName}
        songUrl={coupleConfig.songUrl ?? undefined}
      />
      <Dashboard />
    </>
  );
}
