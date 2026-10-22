import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'sharp');
const root = process.argv[2] || 'public/media/final-v3';
const seconds = [0,1,2,3,3.2,4,5,6,7,8,9,10,10.9,11,12,13,14,15,16,16.3,17,18,19,19.9];
const columns = 6;

for (const [variant, tileWidth, tileHeight] of [['desktop',720,405],['mobile',480,510]]) {
  const layers = await Promise.all(seconds.map(async (second, index) => {
    const frame = Math.min(239, Math.round(second * 12));
    const source = join(root, variant, `${String(frame).padStart(3,'0')}.webp`);
    const input = await sharp(source).resize(tileWidth, tileHeight, { fit: 'fill' }).png().toBuffer();
    return { input, left: (index % columns) * tileWidth, top: Math.floor(index / columns) * tileHeight };
  }));
  await sharp({ create: { width: columns * tileWidth, height: 4 * tileHeight, channels: 3, background: '#030405' } })
    .composite(layers).webp({ quality: 80, effort: 5 }).toFile(join(root, `preview-${variant}.webp`));
  console.log(`Prepared ${variant} preview`);
}
