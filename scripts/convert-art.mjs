import { readdir, stat } from "node:fs/promises";
import sharp from "sharp";

const dir = new URL("../src/assets/art/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const files = (await readdir(dir)).filter((f) => f.endsWith(".jpg"));
let before = 0;
let after = 0;

for (const f of files) {
  const src = dir + f;
  const out = src.replace(/\.jpg$/, ".webp");
  await sharp(src)
    .resize({ height: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  const b = (await stat(src)).size;
  const a = (await stat(out)).size;
  before += b;
  after += a;
  console.log(`${f} ${(b / 1024).toFixed(0)}KB -> ${(a / 1024).toFixed(0)}KB`);
}

console.log(`\ntotal ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);
