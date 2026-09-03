import { Timeline } from "@/components/timeline";
import { TheLetter } from "@/components/the-letter";
import { UnlockedMemories } from "@/components/unlocked-memories";
import { PostitsWall } from "@/components/postits-wall";
import { RandomMessageSection } from "@/components/random-message-section";
import { coupleConfig } from "@/lib/couple-config";

export default function MomentsPage() {
  return (
    <div className="page-fade-in">
      <Timeline />
      <TheLetter
        body={coupleConfig.letterBody}
        closing={coupleConfig.letterClosing}
        authorFirstName={coupleConfig.authorFirstName}
        signatureImageUrl={coupleConfig.signatureImageUrl}
      />
      <UnlockedMemories />
      <PostitsWall />
      <RandomMessageSection />
    </div>
  );
}
