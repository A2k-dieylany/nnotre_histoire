"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, ListChecks, User } from "lucide-react";

const TABS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/moments", label: "Moments", icon: Sparkles },
  { href: "/projets", label: "Projets", icon: ListChecks },
  { href: "/profil", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium tracking-wide transition-all duration-150 active:scale-90 ${
                  active ? "text-rose" : "text-muted/70 hover:text-rose-d"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.25 : 1.75} className="transition-transform" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
