// Run after prepare-final-film.swift. SHARP_PATH may point at a bundled sharp install.
import { createRequire } from 'node:module';
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'sharp');
const source = process.argv[2] || '/tmp/origin-finalframes';
const output = 'public/media/final-v1';
const frames = (await readdir(source)).filter(name => name.endsWith('.jpg')).sort();
for (const [variant, width, quality] of [['desktop', 1440, 73], ['mobile', 960, 68]]) {
  await mkdir(`${output}/${variant}`, { recursive: true });
  let bytes = 0;
  for (let i = 0; i < frames.length; i += 4) {
    await Promise.all(frames.slice(i, i + 4).map(async name => {
      const destination = `${output}/${variant}/${name.replace('.jpg', '.webp')}`;
      await sharp(path.join(source, name)).resize({ width }).webp({ quality, effort: 4 }).toFile(destination);
      bytes += (await stat(destination)).size;
    }));
  }
  console.log(`${variant}: ${frames.length} frames, ${(bytes / 1048576).toFixed(2)} MB`);
}
await sharp(path.join(source, frames[0])).webp({ quality: 82 }).toFile(`${output}/poster-desktop.webp`);
// Match the phone canvas's opening composition: subject on the right, integrated black sky.
const opening = await sharp(path.join(source, frames[0])).extract({ left: 710, top: 0, width: 620, height: 810 }).resize(780, 1019).toBuffer();
await sharp({ create: { width: 780, height: 1688, channels: 3, background: '#030405' } }).composite([{ input: opening, top: 669, left: 0 }]).webp({ quality: 80 }).toFile(`${output}/poster-mobile.webp`);
