import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Direction artistique (voir fonctionnalites.md) : Playfair pour les titres/citations,
// Inter pour le corps de texte, Caveat pour tout ce qui doit ressembler à de l'écriture manuscrite.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
