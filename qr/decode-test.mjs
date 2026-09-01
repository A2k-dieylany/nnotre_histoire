import sharp from "sharp";
import jsQR from "jsqr";

const { data, info } = await sharp("qr/qr-code.png")
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const result = jsQR(new Uint8ClampedArray(data), info.width, info.height);

if (!result) {
  console.log("ÉCHEC : le QR ne se décode pas.");
  process.exit(1);
}

console.log("Décodé avec succès :", result.data);
