# OriginOrbit launch package

## Film refinement — 22 October 2026

- Production deploy: `6ad9f95b06905e67b2b1f493` at https://originorbit.studio/
- Source commit: `8ba735a` on GitHub `main`
- Versioned `final-v2` scroll media has a restrained grade, sharper desktop frames, and phone frames cropped from the 4K source before compression
- The loader prioritizes the current frame and preloads scene stills; captions follow the frame actually displayed
- The scroll journey is shorter on desktop and mobile, and the Studio section uses an exact still of the film astronaut
- Verified the live final frame and caption in phone-sized WebKit and desktop Chromium, with no page errors or horizontal overflow
- Publishing remains manual through the Netlify CLI; pushing to GitHub alone does not update the live site

## Final film integration — 22 October 2026

- Production deploy: `6ad9ec3108c5b581652ef106` at https://originorbit.studio/
- Source integration commit: `b3a7510` on GitHub `main`
- Final supplied 19.834-second film replaces the old footage; optimized replays retain the original edit and audio
- Desktop uses immersive framing; phones and portrait tablets use scene-aware framing with the same approved hero headline and synchronized chapter copy
- Scroll media now has 239 WebP frames per device variant and a bounded directional decode cache; movie files load only on replay
- Verified Chromium and WebKit forward/reverse scrolling, replay, mobile service expansion/collapse, reduced motion, production hydration, and responsive layouts
- Published using the existing authenticated Netlify CLI session after the connector upload returned HTTP 500
- `.netlify/` remains ignored; `netlify.toml` now declares the existing npm build and `dist` output
- A physical iPhone check remains for device-specific performance

## Live status — 22 October 2026

- Production site: https://originorbit.studio/
- Hosting project: https://app.netlify.com/projects/originorbit-studio
- Netlify fallback URL: https://originorbit-studio.netlify.app/
- The domain is registered and managed in Hostinger. Netlify hosts the website. No Hostinger web-hosting plan was purchased.
- Hostinger web records: `@ A 75.2.60.5` (TTL 300) and `www CNAME originorbit-studio.netlify.app` (TTL 300). The previous apex parking A record was `2.57.91.91` and the previous `www` CNAME pointed to `originorbit.studio`.
- Existing Google Workspace MX, SPF, DKIM, and site-verification records were left unchanged.
- Netlify issued a Let’s Encrypt certificate covering `originorbit.studio` and `www.originorbit.studio`. `www` redirects to the apex domain. The optional Netlify promotional badge was switched off.
- The homepage, enquiry and booking pages, embedded Google Form and Calendar, `robots.txt`, `sitemap.xml`, canonical URL, and desktop hero film were checked on the live domain.
- Publishing is manual. Future source edits are **not** published automatically; build and upload the **contents of `dist/`** to the existing Netlify site. Do not upload the source folder as the site root.

## Mobile refresh — 22 October 2026

- Production deploy `6ad926fd5c2bcf51ab441966` is ready. The live homepage, enquiry page, booking page, built JavaScript, and final scroll frame returned HTTP 200.
- The scroll artwork now uses 81 still frames from the film instead of browser video seeking. The film remains playable from its button.
- Phone layouts use shorter chapters, a four-choice service list with one expanded detail, and tighter typography and spacing.
- A phone-sized browser preview was checked for frame advancement, service expansion, and mobile navigation. A physical iPhone Safari check remains for the owner.

The production website is in `dist/`. `originorbit-hostinger-upload.zip` contains the **contents** of that folder, with `index.html` at the archive root. Upload the built files, not the React source or `node_modules`.

## What was checked

- `npm run build` completed for all three pages.
- Local links and asset references in the generated HTML resolve inside `dist/`.
- The archive includes the desktop and mobile films, posters, clay artwork, fonts, brand identity, icons, `robots.txt`, and `sitemap.xml`.
- The generated pages use `https://originorbit.studio/` as the canonical site URL.

## Netlify launch sequence (selected)

1. Sign in to Netlify and create a new project using **Deploy manually**. Upload the entire `dist/` folder. This is a static site; Netlify does not need to run a build for the initial deploy.
2. Confirm the temporary `*.netlify.app` address serves the home page, `/start-a-project/`, `/book-a-call/`, films, and images.
3. Add `originorbit.studio` as the site's custom domain in Netlify. Use the exact DNS records Netlify shows for this site.
4. In Hostinger DNS, replace only the web-facing apex `A`/`ALIAS` record and `www` `CNAME` as Netlify directs. Preserve the Google Workspace `MX` record and all email-related `TXT`/`CNAME` records.
5. Make `originorbit.studio` the primary domain, redirect `www` to it, and wait for Netlify to provision HTTPS. Verify both hostnames over HTTPS.
6. Verify the home page, `/start-a-project/`, `/book-a-call/`, `/robots.txt`, and `/sitemap.xml`, then test the films, images, mobile navigation, Google Form, and Calendar link.

## Hostinger alternative (requires a hosting plan)

1. In hPanel, confirm the account has a web hosting plan and add `originorbit.studio` as an **Empty PHP/HTML website** if it is not already attached to hosting. A domain registration by itself does not provide a `public_html` site folder.
2. In the website's **File Manager**, open that domain's `public_html` folder. If Hostinger created a default page, move it aside or remove it after checking that it is only the parking/placeholder page.
3. Upload `originorbit-hostinger-upload.zip` and extract its **contents directly into `public_html`**. The server should see `public_html/index.html`, `public_html/media/`, `public_html/brand/`, and the two route folders.
4. Follow hPanel's instructions to point the apex `@` record to the hosting IP assigned to this website. The old parking IP is not the target. Keep Google Workspace MX and other existing mail-related TXT records untouched.
5. Activate SSL for both `originorbit.studio` and `www.originorbit.studio`, turn on Force HTTPS, and redirect `www` to the apex domain once both hosts resolve.
6. Check the homepage, `/start-a-project/`, `/book-a-call/`, `/robots.txt`, and `/sitemap.xml` over HTTPS. Check that the film plays and scrolls, images load, mobile navigation works, and the Google Form and Calendar links open.

The Google Form still uses the older **Origin & Orbit** wording and mentions a free introductory creative audit. Update that form separately in Google Forms before promoting the site widely if those statements no longer match the offer.

## Updates after launch

Edit the files in this `website/` source folder, run `npm run build`, and deploy the new `dist/` output. On Netlify, this is a manual deploy until the source is connected to a Git repository. If Hostinger hosting is chosen later, replace the published files and clear its CDN cache if an old version remains visible.
