# Origin & Orbit — final website plan and implemented direction

## Positioning

Origin & Orbit is an independent, founder-led creative studio in India serving clients in India and internationally. It makes images, films, campaigns and interactive experiences through a connected process of creative direction, art direction and AI-native production. The language names work a client can commission, while the process and founder section explain the thinking behind it. The site does not claim commissioned projects, results, testimonials or a larger in-house team.

## Core audience

Founders and marketing leaders launching a brand, product or campaign; teams with a clear offer that needs distinctive expression; and organizations seeking a creative partner able to direct and produce across several formats. The site should help them recognize a relevant output, understand how the collaboration works and start a conversation.

## Services

1. **Images & Visual Worlds** — product and editorial imagery, advertising visuals, social creative and visual campaigns.
2. **Films & Motion** — commercials, product films, launch teasers, social video and motion stories.
3. **Interactive Experiences** — creative websites, interactive launches, microsites and digital storytelling.
4. **Campaigns & Creative Direction** — campaign concepts, art direction, brand worlds and connected execution across formats.

Ongoing creative direction is offered as a collaboration model, not as a fifth discipline. A persistent service index keeps all four offers visible on desktop and laptop while large illustrated panels move through a scroll sequence. Each panel contains its explanation, practical deliverables and enquiry link. Phones display the panels in a normal vertical scroll. There is no fictional portfolio.

## Brand system

- Space black `#08090B`, warm cream `#F4F2ED`, Mars orange `#EF7848`, cobalt `#245CC2`. The section sequence is black film → cream philosophy → warm cream capabilities → black process → cobalt/cream studio → orange enquiry → black footer.
- Bricolage Grotesque for expressive headings and the lowercase logo. Instrument Sans for paragraphs, navigation, controls and form fields. Large display type is calibrated to the Artpill-inspired cinematic opening, then descends through clear editorial headings and 16–18px body text.
- The chosen wordmark uses a hand-shaped orange ampersand with lowercase lettering. Exported SVG variants and a study board are in `branding/`.
- Original matte clay sculptures use cream, orange and cobalt, visible fingerprints, soft directional light and rounded forms. The astronaut keeps the cream suit, brown opaque visor and orange/blue gloves. UI controls remain crisp vectors for clarity.

## Narrative and page order

1. **Scroll film.** The astronaut digs clay on Mars, follows it into space, works it with care and reveals a flower. Copy changes at scene boundaries: “Good ideas take shape,” “A different point of view,” “Made with intention,” “Shape by shape,” then “And just like that, an idea takes shape.” The film completes before the scroll ends so the final image holds briefly. A fine progress line and Skip intro link remain unobtrusive; the utility bar from the first revision is gone.
2. **Studio thought.** “Imagination is a working material.” The copy links curiosity, direction and making. No duplicated service CTA or floating astronaut.
3. **Services.** “One idea. Many expressions.” A persistent list shows all four offers while colored clay-illustrated panels rise in sequence as the visitor scrolls. The list also gives direct access to any panel.
4. **Process.** “A clear idea. Carried through.” Understand → Define → Create → Deliver, each with its own floating clay icon. A replay control clearly identifies the opening film.
5. **Maker and founder.** The clay astronaut occupies a cobalt field with brief material details. Adjacent copy introduces Priyansh Bajpai, the founder who directs the work, and explains direct involvement and accountable collaboration.
6. **Enquiry.** “What shall we make next?” Name, email, service choices and a brief. The working fallback opens a populated email to the verified address. A direct submission endpoint can be configured with `VITE_INQUIRY_ENDPOINT`; loading, success and error states are in place. The site never claims that the fallback has sent a message.

## Media and motion

The 20-second scroll film is a 1080p derivative of the two supplied Google Flow clips. It uses restrained contrast/sharpening. The two clips contain a visible continuity change, and the Gemini mark remains in some frames. Do not describe this as a seamless single take or a client project. Voluntary replay is available in a dialog. On reduced-motion devices, the opening uses the still poster and all decorative motion is disabled.

Motion after the hero is selective: the service panels move with scrolling, the process icons and studio astronaut float gently, and the main CTA border glints. All decorative animations stop for reduced-motion preferences. All four capabilities work through taps and keyboard.

## Completion and checks

The local site is implemented in `outputs/origin-orbit-hero`. Source PNGs are in `artwork-source/`, optimized WebP images are in `public/clay/`, and final vector marks are in `branding/`. Verify the film, anchors, desktop and phone layouts, all four capability states, form validation and honest fallback, keyboard dialog, reduced motion and production build before deployment. A deployed direct form requires a real endpoint; public launch and domain connection are separate from this local revision.
