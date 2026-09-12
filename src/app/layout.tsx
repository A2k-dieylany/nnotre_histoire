import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Fraunces } from "next/font/google";
import "./globals.css";

// Reskin visuel (référence nousdeux.love) : Fraunces remplace Playfair pour
// les titres/citations — même rôle serif, ambiance plus ronde et chaleureuse
// que la direction "luxe discret" d'origine (voir fonctionnalites.md).
// Inter pour le corps de texte, Caveat pour l'écriture manuscrite : inchangés.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notre Histoire",
  description: "Un espace privé.",
  appleWebApp: { capable: true, title: "Notre Histoire", statusBarStyle: "black-translucent" },
  // Auth ne suffit pas seule : on retire aussi le site de l'indexation, même si
  // le contenu réel reste de toute façon inaccessible sans session.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fce4e9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
