import { useEffect, type RefObject } from 'react';
import { FILM_DESKTOP, FILM_MOBILE } from './site-data';

export const FILM_DURATION = 19.333333;
export const FILM_CHAPTERS = [
  { time: 3.2, text: 'Every idea has an origin' },
  { time: 5.0, text: 'Take it somewhere unexpected' },
  { time: 10.3, text: 'Give it shape by hand' },
  { time: 16.7, text: 'Make something worth remembering' },
];
export type FilmStatus = 'loading' | 'ready' | 'error';

type Options = {
  root: RefObject<HTMLElement | null>;
  video: RefObject<HTMLVideoElement | null>;
  progressBar: RefObject<HTMLSpanElement | null>;
  reduced: boolean;
  onChapter: (chapter: number) => void;
  onStatus: (status: FilmStatus) => void;
};

// Decode one native 24 fps video. Serialize seeks: changing currentTime during
// an unfinished seek can prevent Safari from presenting that frame at all.
export function useFilmSequence({ root, video, progressBar, reduced, onChapter, onStatus }: Options) {
  useEffect(() => {
    const section = root.current, film = video.current;
    if (!section || !film || reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const media = matchMedia('(max-width: 700px), (max-width: 1000px) and (orientation: portrait)');
    let start = 0, distance = 1, desired = 0, chapter = -2;
    let raf = 0, disposed = false, visible = true, loaded = false;
    let lastStep = performance.now(), frameCallback = 0;
    const supportsFrameCallback = typeof film.requestVideoFrameCallback === 'function';
    const endTime = () => Math.max(0, (Number.isFinite(film.duration) ? film.duration : FILM_DURATION) - 1 / 24);

    const publish = (time: number) => {
      if (disposed || !loaded) return;
      let next = -1;
      FILM_CHAPTERS.forEach((item, index) => { if (time >= item.time) next = index; });
      if (next !== chapter) { chapter = next; onChapter(next); }
      film.dataset.time = time.toFixed(3);
      film.classList.add('is-ready');
      onStatus('ready');
    };
    const presented = (_: number, metadata: VideoFrameCallbackMetadata) => {
      publish(metadata.mediaTime);
      if (!disposed) frameCallback = film.requestVideoFrameCallback(presented);
    };
    const measure = () => {
      const stage = section.querySelector<HTMLElement>('.hero-stage');
      start = section.getBoundingClientRect().top + window.scrollY;
      distance = Math.max(1, section.offsetHeight - (stage?.offsetHeight || innerHeight));
      schedule();
    };
    const update = (now: number) => {
      raf = 0;
      if (disposed || document.hidden) return;
      const progress = Math.max(0, Math.min(1, (scrollY - start) / distance));
      desired = progress * endTime();
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
      if (!loaded || !visible || film.seeking) return;
      const difference = desired - film.currentTime;
      if (Math.abs(difference) < 1 / 48) return;
      // Short easing absorbs wheel steps without a long delay behind the scroll.
      const elapsed = Math.min(.05, Math.max(1 / 60, (now - lastStep) / 1000));
      const fraction = 1 - Math.exp(-elapsed / .065);
      const next = Math.abs(difference) < .08 ? desired : film.currentTime + difference * fraction;
      lastStep = now;
      film.currentTime = Math.max(0, Math.min(endTime(), next));
    };
    function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(update); }
    const ready = () => {
      if (loaded) return;
      loaded = true;
      if (desired < 1 / 24) publish(film.currentTime);
      else film.currentTime = Math.min(endTime(), desired);
      schedule();
    };
    const seeked = () => {
      if (!supportsFrameCallback) publish(film.currentTime);
      schedule();
    };
    const failed = () => { if (!disposed) onStatus('error'); };
    const resume = () => { lastStep = performance.now(); schedule(); };
    const source = () => {
      loaded = false; chapter = -2;
      film.classList.remove('is-ready');
      onChapter(-1); onStatus('loading');
      const expected = new URL(media.matches ? FILM_MOBILE : FILM_DESKTOP, location.href).href;
      // Native <source media> starts the right download from the initial HTML.
      // Preserve that request instead of restarting it during hydration.
      if (film.currentSrc && film.currentSrc !== expected) {
        film.src = expected;
        film.load();
      } else if (film.readyState >= 2) ready();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    const visibility = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) resume();
    }, { rootMargin: '120px' });
    visibility.observe(section);
    film.addEventListener('loadeddata', ready);
    film.addEventListener('seeked', seeked);
    film.addEventListener('error', failed);
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', resume);
    if (supportsFrameCallback) frameCallback = film.requestVideoFrameCallback(presented);
    film.muted = true;
    film.preload = 'auto';
    media.addEventListener('change', source);
    source();
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (frameCallback) film.cancelVideoFrameCallback(frameCallback);
      observer.disconnect(); visibility.disconnect();
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('visibilitychange', resume);
      film.removeEventListener('loadeddata', ready);
      film.removeEventListener('seeked', seeked);
      film.removeEventListener('error', failed);
      media.removeEventListener('change', source);
      film.pause(); film.removeAttribute('src'); film.load();
    };
  }, [root, video, progressBar, reduced, onChapter, onStatus]);
}
