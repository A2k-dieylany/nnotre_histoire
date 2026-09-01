// Pseudo-aléatoire déterministe (pas Math.random) : mêmes positions au rendu
// serveur et au premier rendu client, donc pas de mismatch d'hydratation.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const STAR_COUNT = 60;

// Arrondi à précision fixe : Math.sin() n'est pas garanti bit-identique entre
// moteurs JS (V8 côté serveur, JavaScriptCore/SpiderMonkey côté navigateur).
// Sans ça, le dernier chiffre de précision flottante peut diverger entre le
// HTML rendu serveur et le recalcul client -> mismatch d'hydratation.
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  top: (seededRandom(i * 1.3) * 100).toFixed(3),
  left: (seededRandom(i * 7.7) * 100).toFixed(3),
  size: (1 + seededRandom(i * 3.1) * 2).toFixed(2),
  delay: (seededRandom(i * 5.9) * 4).toFixed(2),
  duration: (2 + seededRandom(i * 2.3) * 3).toFixed(2),
}));

// CSS pur, pas de canvas/WebGL : ~60 éléments statiques, coût de rendu négligeable
// même sur un mobile bas de gamme.
export function Starfield({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 overflow-hidden transition-opacity duration-[3000ms] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute animate-pulse rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
