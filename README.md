# OriginOrbit website

Run `npm install` and `npm run dev` in this folder. The local preview runs at http://127.0.0.1:5173/. Run `npm run build` for the static production files in `dist/`.

This folder is the source of truth for the website and the root of the [`originorbit-website`](https://github.com/priyanshbajpai/originorbit-website) repository. Commit and push source changes here. The generated `dist/`, installed `node_modules/`, local Netlify state, and upload archives are excluded from Git. Netlify publishing remains manual until the repository is connected to the existing Netlify project.

## V1 experience

- The opening uses a native 24 fps H.264 video with serialized scroll seeking. Desktop uses 1920×1080 footage; phones use a 1080×1080 composition with a continuous camera crop. The playback hook explicitly selects the appropriate source and primes muted inline playback for iOS before pausing for scroll control. Copy follows presented frames, with a seek-completion fallback when paused-frame callbacks are unavailable. Loading is bounded to eight seconds; blocked playback exposes a user-activated retry instead of an indefinite spinner. The two supplied clips are joined after trimming a 0.625-second arm reset from the second clip, producing a film of about 19.3 seconds. A sharp poster remains visible while the first video frame loads; no sparse or low-resolution frame previews are used.
- The homepage immediately states the studio's offer, then presents four services with original clay illustrations. Larger screens use clipped, opaque sliding panels with cached scroll geometry and compositor transforms; phones show four visible service choices and one expanded service at a time.
- The page continues through ongoing creative partnership, point of view, process, the founder, and contact. No client portfolio, results, testimonials, or team claims were invented.
- `/start-a-project/` embeds the supplied Google Form and links to the external form. `/book-a-call/` embeds the supplied Google Calendar appointment page and links to it directly. On small screens, the direct external links are primary because the embeds can be cramped. The site does not claim to know whether a form was submitted or a time was booked.
- `contact@originorbit.studio`, the form URL, and the booking URL are centralized in `src/site-data.ts`.
- The supplied Neo-Pixel OriginOrbit identity is integrated throughout the site. The header switches between light and dark wordmarks as sections pass behind it, the compact wordmark is used on phones, the full wordmark anchors the footer, and OO marks echo the system across the page. Supplied source files and usage guidance are in [`assets/brand/`](assets/brand/).
- Production HTML is prerendered for all three routes so the copy and internal links are available before JavaScript runs. Each route has its own title, description, canonical URL, social preview and crawlable markup. `robots.txt` and `sitemap.xml` assume `https://originorbit.studio/` is the launch domain.

Earlier generated media is retained in `public/media/` and excluded from production by `scripts/prune-unused-media.mjs`. The app uses `src/refined.css` and `src/hero.css`.

## Hero media and playback checks

Regenerate the current assets from the supplied 4K source clips with `python3 scripts/prepare-scrub-video.py /path/to/ffmpeg /path/to/clip-one.mp4 /path/to/clip-two.mp4 public/media/hero-v4`. The encoder preserves the source frame rate, applies a restrained grade, and uses one-second keyframe intervals without B-frames. Change the versioned output URL if replacing media after it has been published, because these assets have immutable caching.

With Playwright available, run `node scripts/check-hero-playback.cjs webkit http://127.0.0.1:5179/` against a production preview. Set `PLAYWRIGHT_PATH` if using a separately installed Playwright package. The check scrolls continuously forward and backward, measures presented frames and seek latency, checks the end and start positions, and captures desktop/mobile screenshots. Set `THROTTLE=1` with the `chromium` engine for an 8 Mbps / 80 ms network test with 4× CPU throttling on the phone viewport. This is browser simulation, not a physical iPhone test.

## Launch notes

The site is deployed on Netlify at `https://originorbit.studio/`; manual uploads are required for changes. The Google Form and Calendar embeds loaded in a local browser check. Their availability and behavior remain controlled by Google. The official email address is linked with `mailto:`; delivery depends on the user's email setup. The hero and playable film both depend on connection and device speed. Reduced-motion visitors receive the static poster and no film download.

The Google Form currently displays the older name “Origin & Orbit” and still mentions a free introductory creative audit. Its copy is managed inside Google Forms, separately from this website. The Google Calendar booking page is live and shows available slots.
