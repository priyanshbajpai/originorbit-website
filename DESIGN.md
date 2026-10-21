# OriginOrbit — design decisions

The current logo uses the Neo-Pixel vector paths in the founder-supplied Gemini HTML, inspired by the attached Space Rabbit reference. See [`assets/brand/guidelines/BRAND-USAGE.md`](assets/brand/guidelines/BRAND-USAGE.md) for the implemented logo system. The notes below record the earlier website art direction.

## Creative direction

A tactile astronaut makes a flower from Martian clay. The film turns the studio's idea of making into a single visual thread. The rest of the site extends its handmade materials into four capability sculptures, a restrained character illustration and an editorial typography system. The agreed Artpill-inspired rhythm informs the opening scale and scrolling; the artwork, palette, copy and studio identity are original to OriginOrbit.

## Type and color

Bricolage Grotesque is used for display headings; Instrument Sans handles paragraphs, navigation, controls and forms. The logo is now a custom vector wordmark and does not depend on either text font. Desktop hero display is capped at 96px. Phone display scales to roughly 40–56px, with body text at least 16px. Bricolage is licensed through its bundled SIL Open Font License, copied beside the font file.

The logo palette uses charcoal `#07080B`, warm cream `#F2EDE8`, clay `#C14D2D`, and cobalt `#1E40A8`. The website also keeps Mars orange `#EF7848` for calls to action and a deeper terracotta for readable text surfaces. The page moves black → cream → warm cream → black → cobalt/cream → orange → black. Hero and photography stay dark enough to let the text read without a heavy rectangular overlay.

## Layout and interaction

The 20-second film maps to approximately 2.6 desktop viewport heights of travel. The final flower frame holds briefly after the video finishes. A two-pixel progress line and quiet Skip intro link replace the old bottom utility panel. Native anchors and fixed navigation let visitors leave the film at any time.

Capabilities form one scroll-driven sequence, not separate services plus portfolio. A cream editorial rail keeps all four numbered offers in view while full-height clay-illustrated panels rise and overlap in orange, cobalt, warm cream and black. Visitors can also select any service directly from the rail. Each panel carries its explanation, deliverables and an enquiry link that selects that service in the contact form. On phones and with reduced motion, the panels become a normal vertical sequence. Primary actions use a restrained illuminated pill treatment. Reduced-motion preferences disable decorative animation and replace the scrub film with its poster.

The process (Understand → Define → Create → Deliver) pairs each step with a distinct original clay icon that floats gently. The astronaut also floats inside the cobalt studio panel beside a founder introduction. Character details are short material traits, not fictional lore or client work. The contact section uses real form fields and explicit email fallback until a submission endpoint is configured.

## Sources and limits

The two user-supplied Google Flow videos and clay references informed the site. New clay sculptures are generated original artwork; their optimized WebP forms, source PNGs and process-icon sprite are saved with the project. The film retains a source continuity change and its full visible source mark. No client history or performance proof is invented.

Taste and Impeccable guidance was read and applied to typography, contrast, motion, accessibility and visual QA. Their automated browser inspectors were not used; page checks were done in the live local browser.
