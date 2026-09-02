"use client";

import { useTransition } from "react";
import { setCycleSharing } from "@/app/cycle-actions";

export function CycleSharingToggle({
  initialEnabled,
  authorFirstName,
}: {
  initialEnabled: boolean;
  authorFirstName: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const enabled = e.target.checked;
    startTransition(async () => {
      const result = await setCycleSharing(enabled);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-white/70">
      <input
        type="checkbox"
        defaultChecked={initialEnabled}
        onChange={handleChange}
        disabled={pending}
      />
      Prévenir {authorFirstName} discrètement d&apos;être attentionné ces jours-là — sans jamais lui montrer de date
    </label>
  );
}
