# Final astronaut film — website integration

Source: `/Users/priyansh/Downloads/Untitled design.mp4` (19.834 seconds, 3840 × 2160, 30 fps, audio). The source edit is preserved. No scenes were regenerated or reordered.

## Assets

`public/media/final-v2/` contains:
- Desktop replay: 1920 × 1080 H.264, approximately 4.2 Mbps, original audio
- Mobile replay: 1280 × 720 H.264, approximately 1.8 Mbps, original audio
- 239 graded WebP scroll frames per variant: desktop 1800 px wide; mobile 960 px wide after cropping from the 4K master
- Responsive opening posters and source metadata; `public/media/studio-film-v2.webp` is a still from the same film

The full movie downloads only when Play the film is pressed. Scroll playback fetches the current frame first, keeps chapter stills in a bounded cache for larger jumps, and releases other decoded frames outside the cache. Mobile frames are cropped before compression to retain detail on high-density screens. Reduced motion uses a still and requests no animation frames.

## Copy timing (same on desktop and mobile)

| Film time | Copy |
| --- | --- |
| 0–3.1 sec | Ideas made / impossible to ignore + approved service description |
| 3.1–5.3 sec | Every idea has an origin |
| 5.3–9.3 sec | Take it somewhere unexpected |
| 9.3–13.3 sec | Find a place to make it |
| 13.3–17.5 sec | Shape it by hand |
| 17.5–end | Make something worth remembering |

Captions follow the rendered frame, rather than advancing ahead of a still-loading scene. Portrait layouts use source-space camera positions to keep the astronaut, station, hands and flower in view. Full uncropped footage remains available in the replay.

## Rebuilding media on macOS

1. Run `scripts/extract-film-stills.swift SOURCE TEMP_FRAMES` using Swift / AVFoundation.
2. Run `scripts/prepare-responsive-film.mjs TEMP_FRAMES` with sharp available (or SHARP_PATH set to an installed sharp module).
3. If changing the replay files, run `scripts/compress-final-film.swift SOURCE OUTPUT WIDTH HEIGHT BITRATE` for the two versions and replace the files in `final-v2`.
4. Bump the media folder version when changing published files, since these paths have immutable cache headers.

## Verification

Browser plugin not available; regular Playwright Chromium and WebKit used as the testing fallback.

Checked 1440×900, 1366×768, 768×1024, and 390×844 layouts. Confirmed no horizontal overflow or page errors; final frame 238 reachable; reverse scrolling returns to frame 0; Skip intro works; mobile services start closed and toggle closed again; replay starts with sound controls and Escape closes it; reduced-motion mode requests zero scroll frames. Production TypeScript / Vite build and prerender pass. Mobile scrolling and final-frame rendering also passed in WebKit. A simulated slow-connection test confirmed that chapter stills remain available during rapid jumps and the exact final frame loads after scrolling settles.

A physical iPhone Safari check remains necessary for device-specific performance.
