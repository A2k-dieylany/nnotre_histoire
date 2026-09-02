import { parseBold } from "@/lib/parse-bold";

// Rendu statique (pas d'animation) du même **gras** que Typewriter anime —
// utilisé une fois le texte déjà entièrement révélé (ou déjà vu par le passé).
export function FormattedText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;

  const segments = parseBold(text);

  return (
    <p className={className}>
      {segments.map((seg, idx) => (seg.bold ? <strong key={idx}>{seg.text}</strong> : seg.text))}
    </p>
  );
}
