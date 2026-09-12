export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full rounded-3xl bg-white p-6 shadow-[0_8px_24px_rgba(90,27,61,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
