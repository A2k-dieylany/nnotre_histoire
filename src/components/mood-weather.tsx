import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/profile";
import { coupleConfig } from "@/lib/couple-config";
import { Card } from "./card";
import { MoodPickerForm } from "./mood-picker-form";

export async function MoodWeather() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: moods } = await supabase
    .from("moods")
    .select("profile_id, emoji, note")
    .eq("mood_date", today);

  const own = moods?.find((m) => m.profile_id === profile.id) ?? null;
  const partnerMood = moods?.find((m) => m.profile_id !== profile.id) ?? null;

  const otherName =
    profile.role === "author" ? coupleConfig.partnerFirstName : coupleConfig.authorFirstName;

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-rose">Météo émotionnelle</p>

      {partnerMood && (
        <p className="text-sm text-wine/80">
          {otherName} se sent aujourd&apos;hui <span className="text-xl">{partnerMood.emoji}</span>
          {partnerMood.note && <span className="italic text-muted"> — {partnerMood.note}</span>}
        </p>
      )}

      <MoodPickerForm currentEmoji={own?.emoji ?? null} />
    </Card>
  );
}
