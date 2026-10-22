# OriginOrbit — corrected eight-second Flow plan

This replaces the earlier two ten-second prompts. Create FOUR videos of EIGHT seconds each, for a 32-second source sequence before trimming. Every clip connects adjacent existing frames.

## Exact upload map

| Video | Duration | Start image | End image | Prompt |
| --- | --- | --- | --- | --- |
| 1 | 8 seconds | [00-dig.png](frames/00-dig.png) | [05-flight.png](frames/05-flight.png) | [Copy prompt](01-dig-to-flight.txt) |
| 2 | 8 seconds | [05-flight.png](frames/05-flight.png) | [10-lab-hatch.png](frames/10-lab-hatch.png) | [Copy prompt](02-flight-to-hatch.txt) |
| 3 | 8 seconds | [10-lab-hatch.png](frames/10-lab-hatch.png) | [15-hand-sculpt.png](frames/15-hand-sculpt.png) | [Copy prompt](03-hatch-to-sculpting.txt) |
| 4 | 8 seconds | [15-hand-sculpt.png](frames/15-hand-sculpt.png) | [20-flower-reveal.png](frames/20-flower-reveal.png) | [Copy prompt](04-sculpting-to-reveal.txt) |

The numbers 00, 05, 10, 15 and 20 in the filenames come from the old storyboard; they are NOT timestamps now. The five anchors sit at 0, 8, 16, 24 and 32 seconds.

Use the same image file on both sides of each join. Generate in order. Compare the actual rendered endpoint with its shared anchor before continuing: matching input images improve continuity but do not guarantee identical rendered endpoints. Regenerate material drift before building the next clip.

## Corrections to the earlier prompts

- The flight and unfinished sculpting images are now real start/end anchors.
- The hatch frame shows the astronaut at the entrance with raw clay. Entering the lab belongs to Video 3.
- The sculpting frame shows cupped petals on a table, with an orange clay block and jars nearby. Preserve those props; there is no stretched ribbon.
- The last image shows five orange petals, an orange round center and open presenting hands. Video 4 finishes in that pose.
- Reveal the hatch with a camera move; the blue porthole must not morph into a door.

## Proposed website copy sync

Keep the existing hero headline and description on the opening digging scene. Add captions as website overlays, never inside generated footage. Use the same narrative on mobile and desktop.

| Source-film range | Visual event | Overlay |
| --- | --- | --- |
| 0–3 s | Digging | Existing hero: Ideas made impossible to ignore |
| 3–8 s | Extracting clay and lifting off | Every idea has an origin |
| 8–16 s | Traveling to station | Take it somewhere unexpected |
| 16–20 s | Entering lab and approaching table | Make room to explore |
| 20–28 s | Hands forming and refining petals | Shape it with intention |
| 28–32 s | Completed flower, open hands | Make something worth remembering |

These timings are direction, not guarantees from Flow. Align captions to actual actions after reviewing the generated footage. In the website, captions and film should share the same scroll progress; 32 seconds of source footage does not require a forced 32-second wait or a proportionally longer page.

## Prompts

### Video 1 — Dig to flight

Start: `frames/00-dig.png`
End: `frames/05-flight.png`

Create one continuous 8-second landscape clay stop-motion shot using the supplied start and end images as visual anchors. Start exactly with the kneeling astronaut digging Mars soil: blue glove holding the small trowel, orange glove supporting the body. In the first 2 seconds, finish a short digging stroke. Over seconds 2–4, leave the trowel on the ground and lift one rough orange clay lump from the exposed patch, bringing both gloves around it. Over seconds 4–8, push gently away from the ground and float upward, carrying the lump securely. The camera rises and eases back with the astronaut, gradually revealing the distant clay space station in the upper right. End in the floating pose shown in the end image, with Mars still below and the station distant. Do not reach or enter the station in this clip. Preserve the cream suit and backpack, charcoal face, oversized ivory stepped double-O eyes, blue right glove, orange left glove and chest buttons exactly as pictured. Keep fingerprints, pits, clay crumbs, warm light and handmade stop-motion character motion; the camera moves smoothly. No cuts, teleporting, eye deformation, extra fingers, disappearing trowel, text, captions or additional logos.

### Video 2 — Flight to the station hatch

Start: `frames/05-flight.png`
End: `frames/10-lab-hatch.png`

Create one continuous 8-second landscape clay stop-motion shot between the supplied images. Begin with the astronaut already floating above Mars, holding the rough orange clay lump in both gloves; the cream clay station is distant in the upper right. Over seconds 0–3, follow the astronaut gliding steadily toward the station while Mars recedes below the picture. Over seconds 3–6, move closer and curve gently around the station to reveal its already-open circular hatch beside the blue porthole. The blue porthole remains a separate fixed feature; it must not transform into the doorway. Over seconds 6–8, ease into the end image: astronaut hovering immediately outside the open orange-rimmed hatch, still holding the unchanged clay lump, warm lab and worktable visible behind. End before the astronaut moves into the lab. Preserve the original character's ivory stepped double-O eyes, charcoal face, cream suit, backpack, blue right glove and orange left glove. Keep the same handmade clay station, tangible fingerprints and warm miniature-set lighting. Smooth camera movement with subtle stop-motion poses. No cuts, dissolves, teleporting, station melting, shape changes to the clay lump, new limbs, text, captions or additional logos.

### Video 3 — Enter the lab and begin sculpting

Start: `frames/10-lab-hatch.png`
End: `frames/15-hand-sculpt.png`

Create one continuous 8-second landscape clay stop-motion shot from the supplied hatch image to the supplied close-up of sculpting. Begin with the astronaut just outside the open hatch, holding the raw orange clay lump in both gloves. Seconds 0–2: drift gently through the doorway into the warm cream clay lab. Seconds 2–4: approach the visible worktable and place the lump on it while the camera follows through the hatch and curves toward the front of the astronaut. Seconds 4–8: the blue and orange gloves visibly press, flatten and pinch portions of the clay into the unfinished cupped petal shapes shown in the end image. Move the camera closer to the hands as this happens. End exactly at the in-progress state: blue glove steadies the left side of the work, orange glove pinches the raised petal on the right, oversized double-O eyes above, blue porthole in the right background. The flower is still unfinished and has no finished round center yet. Retain the jars, clay block and other workbench props visible in the end image as existing lab objects. Preserve the same character, eye shapes, glove colors, clay texture and warm light. All deformation comes from visible finger pressure. No cuts, instant complete flower, self-growing petals, liquid melting, extra fingers, logo-eye morphs, text or captions.

### Video 4 — Finish the flower and reveal it

Start: `frames/15-hand-sculpt.png`
End: `frames/20-flower-reveal.png`

Create one continuous 8-second landscape clay stop-motion shot between the supplied lab images. Begin with the astronaut already working on the unfinished cupped orange petals on the worktable: blue glove stabilizing the left side, orange glove pinching the raised petal on the right. Seconds 0–3: continue those exact hand actions, pressing and rounding the existing petal edges. Seconds 3–5: shape the remaining clay into the final petal arrangement and pinch a small portion of the same workpiece into the round orange center, pressing it into place. Every change must be visibly made by the gloves; maintain the apparent quantity of clay. Seconds 5–7: gently orient the completed flower upright toward the viewer and withdraw both hands into the open presenting pose of the end image. Ease the camera back slightly to reveal the five broad handmade petals, orange round center and the astronaut's large ivory stepped double-O eyes above. Hold that final composition for the last second. Preserve the cream suit, charcoal face, blue right glove, orange left glove, jars, clay block, orange-rimmed blue porthole and warm lab lighting. Preserve tactile fingerprints and imperfect clay edges without texture flicker. No cut, sudden scale jump, self-growing flower, magical extra petals, added blue center, eye deformation, text or captions.

## Delivery notes

Use 16:9 for these landscape images. The logo already forms the character's eyes; do not add a separate floating logo. Use character-master.png only as an optional character reference, never as a start or end image.

Video 3 contains the largest camera and setting change. Check for a hidden cut or room morph; a prompt alone cannot guarantee seamless movement. Keep miniature stop-motion character movement and smooth camera travel.

Source stills are 1672 × 941 px. Resolution comes from generator/export settings, not writing “4K” in a prompt. Exact logo geometry in motion may need the original artwork tracked in post. The videos have not yet been generated or verified.
