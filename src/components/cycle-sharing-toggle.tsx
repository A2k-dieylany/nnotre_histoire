"use client";

import { useTransition } from "react";
import { Bell } from "lucide-react";
import { setCycleSharing } from "@/app/cycle-actions";
import { SettingsRow } from "./settings-row";

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
    <SettingsRow
      icon={Bell}
      iconBg="bg-rose/10"
      iconColor="text-rose-d"
      title="Prévenir discrètement"
      subtitle={`Alerte douce à ${authorFirstName}, sans jamais montrer de date`}
      right={
        <label className={`relative inline-flex h-6 w-11 shrink-0 items-center ${pending ? "opacity-60" : ""}`}>
          <input
            type="checkbox"
            defaultChecked={initialEnabled}
            onChange={handleChange}
            disabled={pending}
            className="peer sr-only"
          />
          <span className="absolute inset-0 rounded-full bg-line transition-colors duration-150 peer-checked:bg-rose" />
          <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 peer-checked:translate-x-5" />
        </label>
      }
    />
  );
}
