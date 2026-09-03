export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] ${className}`}
    >
      {children}
    </div>
  );
}
