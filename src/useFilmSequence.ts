import { useEffect, type RefObject } from 'react';

export const FILM_DURATION = 19.834;
export const FRAME_COUNT = 239;
export const FILM_CHAPTERS = [
  { time: 3.1, text: 'Every idea has an origin' },
  { time: 5.3, text: 'Take it somewhere unexpected' },
  { time: 9.3, text: 'Find a place to make it' },
  { time: 13.3, text: 'Shape it by hand' },
  { time: 17.5, text: 'Make something worth remembering' },
];
const sceneFrames = [0, ...FILM_CHAPTERS.map(item => Math.round(item.time / FILM_DURATION * (FRAME_COUNT - 1))), FRAME_COUNT - 1];

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
    const limit = phone ? 17 : 21;
    let target = 0, drawn = -1, direction = 1, chapter = -2;
    let raf = 0, disposed = false, visible = true, dirty = true;
    let width = 0, height = 0, start = 0, distance = 1;
    const path = (index: number) => `/media/final-v2/${phone ? 'mobile' : 'desktop'}/${String(index).padStart(3, '0')}.webp`;
    const measure = () => {
      const bounds = surface.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, phone ? 2 : 1.5, (phone ? 960 : 1800) / Math.max(1, bounds.width));
      width = Math.round(bounds.width * ratio);
      height = Math.round(bounds.height * ratio);
      if (surface.width !== Math.max(1, width)) surface.width = Math.max(1, width);
      if (surface.height !== Math.max(1, height)) surface.height = Math.max(1, height);
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
        // Phone frames were cropped from the 4K master before compression;
        // another horizontal crop here would enlarge a low-resolution sliver.
        const imageHeight = image.height * width / image.width;
        // A seamless black sky carries the copy. The miniature remains generous
        // below it, without placing a detached widescreen player on the page.
        const opening = Math.max(0, 1 - time / 3.4);
        const available = height * (.75 - opening * .21);
        const dh = Math.min(imageHeight, available);
        const sh = dh * image.width / width;
        const restingTop = Math.max(height * .27, height * .54 - dh / 2);
        const dy = restingTop * (1 - opening) + (height - dh) * opening;
        context.drawImage(image, 0, Math.max(0, (image.height - sh) * .36), image.width, sh, 0, dy, width, dh);
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
      const furthest = [...cache.keys()].filter(i => i !== drawn && i !== target && !sceneFrames.includes(i)).sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
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
        if (disposed || (!sceneFrames.includes(index) && Math.abs(index - target) > limit)) bitmap.close();
        else { cache.set(index, bitmap); trim(); schedule(); }
      } catch (error) {
        if (!controller.signal.aborted) failed.add(index);
      } finally {
        if (pending.get(index) === controller) pending.delete(index);
        if (!disposed) pump();
      }
    };
    const pump = () => {
      if (disposed || !visible || document.hidden) return;
      // Scene frames stay decoded so a large jump can show the correct place
      // immediately. Obsolete nearby requests yield to the current frame.
      for (const [index, controller] of pending) {
        if (!sceneFrames.includes(index) && Math.abs(index - target) > 4) {
          pending.delete(index);
          controller.abort();
        }
      }
      if (!cache.has(target) && !pending.has(target) && pending.size >= 4) {
        const obsolete = [...pending.keys()].filter(index => index !== target).sort((a, b) => Math.abs(b - target) - Math.abs(a - target))[0];
        if (obsolete !== undefined) {
          pending.get(obsolete)?.abort();
          pending.delete(obsolete);
        }
      }
      const upcomingScenes = sceneFrames.filter(index => !cache.has(index) && !pending.has(index) && !failed.has(index)).sort((a, b) => Math.abs(a - target) - Math.abs(b - target));
      const wanted = [target, target + direction, upcomingScenes[0], upcomingScenes[1], target - direction, target + direction * 2, ...upcomingScenes.slice(2)];
      for (const index of wanted) {
        if (pending.size >= 4) break;
        if (index === undefined || index < 0 || index >= FRAME_COUNT || cache.has(index) || pending.has(index) || failed.has(index)) continue;
        if (sceneFrames.includes(index) && [...pending.keys()].filter(item => sceneFrames.includes(item)).length >= 3) continue;
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
      // Never reveal a future scene early while its actual target frame loads.
      const earlier = [...cache.keys()].filter(index => index <= target);
      const nearest = cache.has(target) ? target : earlier.sort((a, b) => b - a)[0];
      if (nearest !== undefined) draw(nearest);
      trim(); pump();
    };
    function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(update); }
    // Observe the fixed stage, not the canvas: changing a canvas bitmap can
    // itself retrigger ResizeObserver and starve image decoding on some phones.
    const observer = new ResizeObserver(measure);
    observer.observe(section.querySelector('.hero-stage') || section);
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
