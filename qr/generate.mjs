import QRCode from "qrcode";
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const URL = "https://notre-histoire-seven.vercel.app";
const DARK = "#7a1f2b"; // bordeaux, cohérent avec la direction artistique
const SIZE = 1000;

const svg = await QRCode.toString(URL, {
  type: "svg",
  errorCorrectionLevel: "H", // tolère ~30% de dégâts/occlusion — nécessaire pour couvrir le centre avec le cœur
  margin: 3,
  color: { dark: DARK, light: "#ffffff" },
  width: SIZE,
});

// Le viewBox généré est en unités de MODULES QR (ex: "0 0 43 43"), pas en pixels
// même si width/height="1000" — il faut extraire ces dimensions plutôt que de
// deviner, sinon l'overlay se dessine hors champ (ce qui vient d'arriver).
const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
if (!viewBoxMatch) {
  throw new Error("viewBox introuvable dans le SVG généré — format inattendu");
}
const modules = Number(viewBoxMatch[1]);

// Cœur inséré au centre, sur un disque blanc (quiet zone locale) pour ne pas
// perturber le décodage des modules directement sous le logo. Tailles en
// unités de modules, cohérentes avec le viewBox réel du QR.
const center = modules / 2;
const heartScale = modules * 0.09;
const heartPath = `M0,${heartScale * 0.3}
  C0,${-heartScale * 0.3} ${-heartScale},${-heartScale * 0.3} ${-heartScale},${heartScale * 0.3}
  C${-heartScale},${heartScale * 0.9} 0,${heartScale * 1.3} 0,${heartScale * 1.7}
  C0,${heartScale * 1.3} ${heartScale},${heartScale * 0.9} ${heartScale},${heartScale * 0.3}
  C${heartScale},${-heartScale * 0.3} 0,${-heartScale * 0.3} 0,${heartScale * 0.3} Z`;

const overlay = `
  <circle cx="${center}" cy="${center}" r="${modules * 0.12}" fill="white" />
  <path d="${heartPath}" fill="${DARK}" transform="translate(${center},${center - heartScale * 0.9})" />
`;

const svgWithHeart = svg.replace("</svg>", `${overlay}</svg>`);

writeFileSync("qr/qr-code.svg", svgWithHeart);
await sharp(Buffer.from(svgWithHeart)).png().toFile("qr/qr-code.png");

console.log("QR généré : qr/qr-code.png + qr/qr-code.svg");
