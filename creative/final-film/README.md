# Final astronaut film — website integration

Source: `/Users/priyansh/Downloads/Untitled design.mp4` (19.834 seconds, 3840 × 2160, 30 fps, audio). The source edit is preserved. No scenes were regenerated or reordered.

## Assets

`public/media/final-v1/` contains:
- Desktop replay: 1920 × 1080 H.264, approximately 4.2 Mbps, original audio
- Mobile replay: 1280 × 720 H.264, approximately 1.8 Mbps, original audio
- 239 WebP scroll frames per variant: desktop 1440 × 810; mobile 960 × 540
- Responsive opening posters and source metadata

The full movie downloads only when Play the film is pressed. Scroll playback fetches a small directional window and releases decoded frames outside its bounded cache. Reduced motion uses a still and requests no animation frames.

## Copy timing (same on desktop and mobile)

| Film time | Copy |
| --- | --- |
| 0–2.4 sec | Ideas made / impossible to ignore + approved service description |
| 2.4–4.4 sec | Every idea has an origin |
| 4.4–8.0 sec | Take it somewhere unexpected |
| 8.0–13.2 sec | Make room to explore |
| 13.2–17.6 sec | Shape it with intention |
| 17.6–end | Make something worth remembering |

Captions follow the rendered frame, rather than advancing ahead of a still-loading scene. Portrait layouts use source-space camera positions to keep the astronaut, station, hands and flower in view. Full uncropped footage remains available in the replay.

## Rebuilding media on macOS

1. Run `scripts/prepare-final-film.swift SOURCE TEMP_FRAMES OUTPUT_MEDIA` using Swift / AVFoundation.
2. Run `scripts/compress-final-frames.mjs TEMP_FRAMES` with sharp available (or SHARP_PATH set to an installed sharp module).
3. Run `scripts/compress-final-film.swift SOURCE OUTPUT WIDTH HEIGHT BITRATE` for the two replay files.
4. Bump the media folder version when changing published files, since these paths have immutable cache headers.

## Verification

Browser plugin not available; regular Playwright Chromium used as the testing fallback.

Checked 1440×900, 1366×768, 768×1024, 390×844 and 375×667 layouts. Confirmed no horizontal overflow or page errors; final frame 238 reachable; reverse scrolling returns to frame 0; Skip intro works; mobile services start closed and toggle closed again; replay starts with sound controls and Escape closes it; reduced-motion mode requests zero scroll frames. Production TypeScript / Vite build and prerender pass.

A physical iPhone Safari check remains necessary for device-specific performance.
