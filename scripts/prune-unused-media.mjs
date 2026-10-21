import { rm } from 'node:fs/promises';

// Keep original media in public/ for future edits while shipping only assets
// referenced by the current website. Smaller archives deploy more reliably.
for (const filename of ['origin-orbit-film-v4-mobile.mp4', 'origin-orbit-film-v5-mobile.mp4']) {
  await rm(new URL(`../dist/media/${filename}`, import.meta.url), { force: true });
}
