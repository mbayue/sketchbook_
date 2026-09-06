// Render public/favicon.svg to a PNG fallback (favicon.png).
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const svg = fileURLToPath(new URL("../public/favicon.svg", import.meta.url));
const png = fileURLToPath(new URL("../public/favicon.png", import.meta.url));

await sharp(svg).resize(64, 64).png().toFile(png);

console.log("favicon.png written");
