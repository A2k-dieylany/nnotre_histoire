import type { LucideIcon } from "lucide-react";

export function SettingsRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  right,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
        <Icon size={20} className={iconColor} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-white">{title}</p>
        {subtitle && <p className="truncate text-[13px] text-white/50">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
