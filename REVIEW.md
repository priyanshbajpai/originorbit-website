# Origin & Orbit — final local review (20 October 2026)

## Verified in the live local browser

- Desktop opening at 1280 × 720: Bricolage headline and wordmark render, the fixed navigation is legible, the film is ready with a 20-second duration, and the bottom utility strip is absent.
- Closing beat: at story progress near the end, the film is at 19.92 seconds, the astronaut holds the clay flower, and “And just like that, an idea takes shape” remains in view before the cream introduction. The film shifts right to leave room for the copy without scaling into a letterbox.
- Direct loading of `/#services` settles with the section approximately 76px below the desktop header. The header changes to its light treatment. In-page anchors reach the target and update browser history.
- Services: at 1280 × 720 and 825 × 804, all four offers remain in a persistent index while large illustrated panels rise through the viewport. Direct selection from the index works; the active panel is exposed to keyboard and assistive technology. At 390px, all four service names appear in a compact index and the panels follow in a normal vertical scroll. With reduced motion, the scroll deck becomes a stacked sequence.
- Enquiry handoff: clicking a service panel’s “Start a project” link selects that service in the contact form. This was verified with Films & Motion. The name, email and project fields are required. Attempting an empty submission leaves the URL unchanged and focuses the first invalid field. A configured direct-submission endpoint was unavailable, so external delivery was not exercised.
- Replay dialog opens with the 20-second video and native controls. Escape closes it and restores focus to the replay button.
- Reduced-motion emulation at 320 × 740 shows the static hero poster, hides the scrub video and reduces the story to one viewport.
- No horizontal overflow at 320, 390, 768 or 1440px. A 768px studio-grid overflow found during review was fixed. Desktop, phone and tablet screenshots were inspected. Browser console inspection found no errors or warnings in the checked tabs.
- `npm run build` passes TypeScript and Vite after the latest changes. The four new clay process icons and astronaut have CSS floating motion with reduced-motion fallbacks. The re-exported 1080p film shows the original Gemini mark without the previous delogo blur.

## Visual decisions and remaining limits

The page moves through black, cream, orange/cobalt/warm cream/black service panels, black process, cobalt/cream studio and orange contact without repeating the same split section throughout. The services sequence presents original clay illustrations alongside practical offers, so no fictional portfolio appears. The separate astronaut lore panel was folded into the studio section; the process has its own icon set.

The user-provided film still contains a continuity change between its two source clips and visible Gemini marks in some frames. The 1080p web file is approximately 20 MB, which is the principal loading cost. The local enquiry form currently opens a populated email draft. To enable direct on-page submission, configure and test a real `VITE_INQUIRY_ENDPOINT` before publication.

The Taste and Impeccable guidance informed this design, but their automated browser inspectors were not run. Browser review used the supported local UI controls.
