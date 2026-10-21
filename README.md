# OriginOrbit website

Run `npm install` and `npm run dev` in this folder. The local preview runs at http://127.0.0.1:5173/. Run `npm run build` for the static production files in `dist/`.

This folder is the source of truth for the website and the root of the [`originorbit-website`](https://github.com/priyanshbajpai/originorbit-website) repository. Commit and push source changes here. The generated `dist/`, installed `node_modules/`, local Netlify state, and upload archives are excluded from Git. Netlify publishing remains manual until the repository is connected to the existing Netlify project.

## V1 experience

- The opening uses 81 still frames extracted from the user-supplied astronaut film. Scrolling selects a frame directly, so the artwork does not depend on browser video seeking. The poster is visible until the first frame loads. The 1080p video remains available through “Play the film.” Frame extraction is reproducible with `scripts/extract-scroll-frames.swift`.
- The homepage immediately states the studio's offer, then presents four services with original clay illustrations. Larger screens use a pinned panel sequence; phones show four visible service choices and one expanded service at a time.
- The page continues through ongoing creative partnership, point of view, process, the founder, and contact. No client portfolio, results, testimonials, or team claims were invented.
- `/start-a-project/` embeds the supplied Google Form and links to the external form. `/book-a-call/` embeds the supplied Google Calendar appointment page and links to it directly. On small screens, the direct external links are primary because the embeds can be cramped. The site does not claim to know whether a form was submitted or a time was booked.
- `contact@originorbit.studio`, the form URL, and the booking URL are centralized in `src/site-data.ts`.
- The supplied Neo-Pixel OriginOrbit identity is integrated throughout the site. The header switches between light and dark wordmarks as sections pass behind it, the compact wordmark is used on phones, the full wordmark anchors the footer, and OO marks echo the system across the page. Supplied source files and usage guidance are in [`assets/brand/`](assets/brand/).
- Production HTML is prerendered for all three routes so the copy and internal links are available before JavaScript runs. Each route has its own title, description, canonical URL, social preview and crawlable markup. `robots.txt` and `sitemap.xml` assume `https://originorbit.studio/` is the launch domain.

The original source clips and superseded site files are preserved in `work/archive/`. `src/style.css` is retained for reference but the app uses `src/refined.css`.

## Launch notes

The site is deployed on Netlify at `https://originorbit.studio/`; manual uploads are required for changes. The Google Form and Calendar embeds loaded in a local browser check. Their availability and behavior remain controlled by Google. The official email address is linked with `mailto:`; delivery depends on the user's email setup. The scroll artwork is independent of video buffering, though the separate playable film still depends on connection and device speed.

The Google Form currently displays the older name “Origin & Orbit” and still mentions a free introductory creative audit. Its copy is managed inside Google Forms, separately from this website. The Google Calendar booking page is live and shows available slots.
