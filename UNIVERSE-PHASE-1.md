# A Universe Inside an Idea — Phase 1 audit

21 October 2026 · Origin & Orbit

This document records what exists today and the production architecture for the new concept. It does not claim that the new film, imagery, or route has been made.

## Creative direction

The working signature concept is **A Universe Inside an Idea**: a small handmade terracotta sphere opens to reveal connected miniature worlds for imagery, film, interaction, and campaigns. The recurring cobalt object and the sphere's clay construction must remain recognizable across those worlds. The core line is **One idea. Many expressions.**

The new film is an optional experience. The ordinary homepage must explain the studio and let visitors reach work, services, and contact immediately.

## Existing site and assets

| Area | What exists | Decision |
| --- | --- | --- |
| Frontend | Vite, React 19, TypeScript; a single `src/main.tsx` and `src/style.css`; no route library | Evolve the existing app. Separate shared site sections from cinematic behavior as the new pages are built. |
| Homepage | A 460svh pinned astronaut film, then studio thought, four services, process, founder, contact | Replace the mandatory film hero with a sphere-led commercial hero after the new assets exist. Keep useful content and artwork. |
| Film | `public/media/origin-orbit-film-v3.mp4`, approximately 20 MB; seven poster/still images | Preserve as a finished original studio experiment. Do not present it as client work. It is not footage for the new sphere narrative. |
| Clay artwork | Four service sculptures, astronaut character art, four process icons | Reuse selectively where they strengthen the site. The sphere worlds need their own coherent visual bible. |
| Identity | Self-hosted Bricolage Grotesque and Instrument Sans; vector wordmarks | Retain while art-directing the new experience. |
| Services | Images & Visual Worlds; Films & Motion; Interactive Experiences; Campaigns & Creative Direction | Keep this menu and make real deliverables easy to scan. |
| Contact | Direct email and a form that currently opens an email draft; optional `VITE_INQUIRY_ENDPOINT` | Keep the truthful fallback. Do not describe an unconfigured form as direct submission. |
| Portfolio | One completed astronaut film experiment is evidenced here; no client work has been supplied | Launch with an intentionally small work section. Add the new Universe piece when finished, labelled as original studio work. |

The live design tokens are ink `#08090b`, paper `#f4f2ed`, orange `#ef7848`, and blue `#245cc2`. These take priority over the alternate values suggested in the master brief. Service panels already use some related deeper shades; those can be rationalized during the redesign.

## Recommended site structure

### `/` — client-facing homepage

1. **Hero:** clear positioning, one sculptural sphere poster or short ambient teaser, `Explore the work`, `Enter the Universe`, and a visible project enquiry path.
2. **Selected Work:** a compact, truthful presentation of *The Space Maker* (the completed astronaut film). When complete, add *A Universe Inside an Idea* as a second original studio experiment. Each entry needs a title, medium, role, and honest project context.
3. **Services:** retain the four current categories and their specific deliverables. Use clay art as a recognizable design system, while relying on the work itself for proof.
4. **Approach and process:** “The idea comes first. The medium follows.” Explain tangible outputs from discovery through delivery.
5. **Founder and contact:** preserve Priyansh's direct involvement, location, and working email route.

The first work entry should sit immediately after the hero. With only one finished piece available now, the section should be visually deliberate and modest in scale rather than padded with fictional cases.

### `/universe` — optional cinematic experience

Use a dedicated route with native page scrolling, one pinned visual stage, live HTML captions and controls, and a natural release into the same Selected Work component used on the homepage. Include Exit and Skip to Work controls. Support direct loading, Back/Forward navigation, reduced motion, and media failure.

The site has no current route system. A small route layer and page-level code split are enough; do not load the full cinematic media on `/`. The deployment will also need a fallback that serves the app shell for a direct request to `/universe`.

### Code responsibilities when implementation begins

- Shared: navigation, brand identity, service data, Selected Work cards, footer, contact.
- Homepage only: commercial hero and lightweight teaser.
- Universe only: scene manifest, scroll progress, visual player, scene overlays, and media fallbacks.
- Keep the scroll engine outside ordinary content sections and release event listeners when the route changes.

The current app has separate scroll handlers for the astronaut film, header, and service deck. Their effects must be audited as the page is split so the new film does not add competing listeners or force React to rerender the whole site on every scroll.

## Media-production reality

- The new sphere, four miniature worlds, recurring product, and their connecting footage do **not** exist in the repository.
- Built-in image generation is available for anchor frames. Paper can help lay out and review compositions, but it is not the finished scroll-film renderer.
- No connected Google Flow video-generation API or local `ffmpeg`/`ffprobe` executable was found in this environment. The user can generate Flow clips manually. Post-production capability needs a separate check before promising a finished master.
- The earlier production constraint was two 10-second Flow clips. Eight distinct scenes in roughly 20 seconds average 2.5 seconds each. This can work as an energetic montage, but it is a poor fit for four fully legible worlds plus seamless entry and exit. Phase 2 must define a rhythm that preserves the story and identify where matched or hidden cuts are acceptable. A longer film or fewer film scenes would be more spacious if the constraint changes.
- If two clips remain the limit, make the clip boundary a planned transition surface, not an accidental seam. Both clips need shared reference frames, sphere geometry, color, and the exact same cobalt object.
- Existing 20 MB video currently preloads on the homepage. The redesign should make the homepage poster the first-view asset and load the full new film only when `/universe` is entered.

## Working creative decisions for Phase 2

1. **Hero object:** one palm-sized, irregular terracotta sphere on an almost-black tabletop; its opening is a physical clay seam, not a portal effect made of particles.
2. **Recurring object:** define a simple cobalt product sculpture with a silhouette that remains identifiable as a still, on a screen, within an interface, and in campaign set pieces. Its exact geometry is the first art-direction decision still to make.
3. **Visual continuity:** matte clay, visible hand marks, fixed object proportions, directional warm key light, limited cobalt accents, macro lens language, and physically motivated transformations.
4. **Story clarity:** each world should show what the studio can *make*, not imply a fabricated client result. On-screen copy remains real HTML, outside generated frames.
5. **Ending:** return to the same sphere/table composition, then let the webpage reveal genuine studio work. Do not auto-navigate.

## Phase sequence

| Phase | Deliverable | Gate before moving on |
| --- | --- | --- |
| 1. Audit and architecture | This inventory, two-page structure, feasibility findings | Existing site builds; production limits are explicit. |
| 2. Art direction | Visual bible, 8-scene rhythm, shot/anchor manifest, prompts and continuity sheet | Approve the sphere, cobalt object, world designs, and clip boundary. |
| 3. Media | Anchor imagery, user-generated or available footage, reviewed master and web exports | Check visual continuity and actual video quality. Mark anything missing honestly. |
| 4. Homepage | New hero, real work section, adjusted services/copy | Build and responsive review. |
| 5. Universe | Direct-load route, scroll presentation, skip/exit, work transition | Test seeking or image sequence on actual browsers before choosing. |
| 6. Polish | Accessibility, motion, media loading, performance, contact and navigation QA | Report only tests actually run. |

## Next step

Create the **Phase 2 visual bible and shot map**. Begin by fixing the cobalt object's geometry and the sphere's opening mechanism. Then time the eight story beats against the two-clip limit. Do not generate a batch of videos until the anchor frames and transition points are coherent.
