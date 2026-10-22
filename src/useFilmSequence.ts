import { useEffect, type RefObject } from 'react';

export const FILM_DURATION = 19.834;
export const FRAME_COUNT = 239;
export const FILM_CHAPTERS = [
  { time: 2.4, text: 'Every idea has an origin' },
  { time: 4.4, text: 'Take it somewhere unexpected' },
  { time: 8.0, text: 'Make room to explore' },
  { time: 13.2, text: 'Shape it with intention' },
  { time: 17.6, text: 'Make something worth remembering' },
];

// Source-space focus and width. Open the view during flight to keep the astronaut
// and station together; move closer again for the hands and finished flower.
const PHONE_CAMERA = [
  [0, .72, .43], [2.8, .72, .43], [4.8, .59, .55],
  [7.2, .57, .68], [10, .54, .66], [12.8, .53, .62],
  [13.5, .52, .51], [17.6, .55, .54], [19.834, .61, .54],
];
function cameraAt(time: number) {
  const right = PHONE_CAMERA.findIndex(point => point[0] >= time);
  if (right <= 0) return PHONE_CAMERA[Math.max(0, right)].slice(1);
  const a = PHONE_CAMERA[right - 1], b = PHONE_CAMERA[right];
  const t = (time - a[0]) / (b[0] - a[0]);
  const eased = t * t * (3 - 2 * t);
  return [a[1] + (b[1] - a[1]) * eased, a[2] + (b[2] - a[2]) * eased];
}

type Options = {
  root: RefObject<HTMLElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
  progressBar: RefObject<HTMLSpanElement | null>;
  reduced: boolean;
  mobile: boolean;
  onChapter: (chapter: number) => void;
};
export function useFilmSequence({ root, canvas, progressBar, reduced, mobile, onChapter }: Options) {
  useEffect(() => {
    const section = root.current, surface = canvas.current;
    // Check the actual media queries here as well: hydration initially uses the
    // server defaults, which must not start desktop downloads on a phone.
    if (!section || !surface || reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const phone = matchMedia('(max-width: 700px), (max-width: 1000px) and (orientation: portrait)').matches;
    const context = surface.getContext('2d', { alpha: false });
    if (!context) return;
    const cache = new Map<number, ImageBitmap>();
    const pending = new Map<number, AbortController>();
    const failed = new Set<number>();
    const limit = phone ? 14 : 18;
    let target = 0, drawn = -1, direction = 1, chapter = -2;
    let raf = 0, disposed = false, visible = true, dirty = true;
    let width = 0, height = 0, start = 0, distance = 1;
    const path = (index: number) => `/media/final-v1/${phone ? 'mobile' : 'desktop'}/${String(index).padStart(3, '0')}.webp`;
    const measure = () => {
      const bounds = surface.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, phone ? 2 : 1.5);
      width = Math.round(bounds.width * ratio);
      height = Math.round(bounds.height * ratio);
      surface.width = Math.max(1, width); surface.height = Math.max(1, height);
      start = section.getBoundingClientRect().top + window.scrollY;
      distance = Math.max(1, section.offsetHeight - bounds.height);
      dirty = true;
      schedule();
    };
    const draw = (index: number) => {
      const image = cache.get(index);
      if (!image || (!dirty && index === drawn)) return;
      const time = index / (FRAME_COUNT - 1) * FILM_DURATION;
      context.fillStyle = '#030405'; context.fillRect(0, 0, width, height);
      if (phone) {
        const [focus, fraction] = cameraAt(time);
        const sw = image.width * fraction;
        const sx = Math.max(0, Math.min(image.width - sw, image.width * focus - sw / 2));
        const imageHeight = image.height * width / sw;
        // A seamless black sky carries the copy. The miniature remains generous
        // below it, without placing a detached widescreen player on the page.
        const opening = Math.max(0, 1 - time / 3.4);
        const available = height * (.75 - opening * .21);
        const dh = Math.min(imageHeight, available);
        const sh = dh * sw / width;
        const restingTop = Math.max(height * .28, height * .59 - dh / 2);
        const dy = restingTop * (1 - opening) + (height - dh) * opening;
        context.drawImage(image, sx, Math.max(0, (image.height - sh) * .36), sw, sh, 0, dy, width, dh);
        const edge = Math.min(dh * .12, height * .055);
        const fade = context.createLinearGradient(0, dy, 0, dy + edge);
        fade.addColorStop(0, '#030405'); fade.addColorStop(1, '#03040500');
        context.fillStyle = fade; context.fillRect(0, dy, width, edge);
        if (dy + dh < height - 2) {
          const bottom = context.createLinearGradient(0, dy + dh - edge, 0, dy + dh);
          bottom.addColorStop(0, '#03040500'); bottom.addColorStop(1, '#030405');
          context.fillStyle = bottom; context.fillRect(0, dy + dh - edge, width, edge);
        }
      } else {
        const scale = Math.max(width / image.width, height / image.height);
        const sw = width / scale, sh = height / scale;
        context.drawImage(image, (image.width - sw) * .53, (image.height - sh) * .5, sw, sh, 0, 0, width, height);
      }
      surface.classList.add('is-ready');
      surface.dataset.frame = String(index);
      drawn = index; dirty = false;
      let next = -1;
      FILM_CHAPTERS.forEach((item, i) => { if (time >= item.time) next = i; });
      if (next !== chapter) { chapter = next; onChapter(next); }
    };
    const trim = () => {
      if (cache.size <= limit) return;
      const furthest = [...cache.keys()].filter(i => i !== drawn && i !== target).sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
      while (cache.size > limit && furthest.length) {
        const index = furthest.shift()!;
        cache.get(index)?.close(); cache.delete(index);
      }
    };
    const load = async (index: number) => {
      const controller = new AbortController(); pending.set(index, controller);
      try {
        const response = await fetch(path(index), { signal: controller.signal, cache: 'force-cache' });
        if (!response.ok) throw new Error(`Frame ${response.status}`);
        const bitmap = await createImageBitmap(await response.blob());
        if (disposed || Math.abs(index - target) > limit) bitmap.close();
        else { cache.set(index, bitmap); trim(); schedule(); }
      } catch (error) {
        if (!controller.signal.aborted) failed.add(index);
      } finally { pending.delete(index); if (!disposed) pump(); }
    };
    const pump = () => {
      if (disposed || !visible || document.hidden) return;
      // Prioritise the current frame, then a short look-ahead. A fast scroll
      // abandons obsolete requests instead of filling an unbounded queue.
      for (const [index, controller] of pending) if (Math.abs(index - target) > limit) controller.abort();
      const wanted = [target];
      for (let offset = 1; offset <= 9; offset++) {
        wanted.push(target + offset * direction);
        if (offset <= 4) wanted.push(target - offset * direction);
      }
      for (const index of wanted) {
        if (pending.size >= 4) break;
        if (index < 0 || index >= FRAME_COUNT || cache.has(index) || pending.has(index) || failed.has(index)) continue;
        void load(index);
      }
    };
    const update = () => {
      raf = 0;
      if (disposed || document.hidden) return;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / distance));
      const next = Math.round(progress * (FRAME_COUNT - 1));
      if (next !== target) direction = next > target ? 1 : -1;
      target = next;
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
      const nearest = cache.has(target) ? target : [...cache.keys()].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
      if (nearest !== undefined) draw(nearest);
      trim(); pump();
    };
    function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(update); }
    const observer = new ResizeObserver(measure); observer.observe(surface);
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) schedule(); }, { rootMargin: '200px' });
    visibility.observe(section);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    return () => {
      disposed = true; cancelAnimationFrame(raf); observer.disconnect(); visibility.disconnect();
      window.removeEventListener('scroll', schedule); document.removeEventListener('visibilitychange', schedule);
      pending.forEach(controller => controller.abort()); cache.forEach(image => image.close());
    };
  }, [root, canvas, progressBar, reduced, mobile, onChapter]);
}
