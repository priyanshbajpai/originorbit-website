import { useEffect, useRef, useState } from 'react';
import { FILM_DESKTOP } from './site-data';
import { Arrow } from './Shared';

const captions = [
  { start: 0.28, text: 'Good ideas take shape' },
  { start: 0.43, text: 'A different point of view' },
  { start: 0.58, text: 'Made with intention' },
  { start: 0.72, text: 'Shape by shape' },
  { start: 0.86, text: 'An idea takes shape' },
];
const mobileCaptions = [
  { start: 0.28, text: 'An idea leaves the ground' },
  { start: 0.43, text: 'A new point of view' },
  { start: 0.58, text: 'Shape by shape' },
  { start: 0.72, text: 'Something begins to bloom' },
  { start: 0.86, text: 'A world of its own' },
];
const FRAME_COUNT = 81;
const MOBILE_FRAME_COUNT = 41;
const framePath = (index: number, mobile: boolean) => `/media/${mobile ? 'scroll-frames-mobile' : 'scroll-frames'}/${String(index).padStart(3, '0')}.jpg`;
const mobileFocus = (frame: number) => {
  const points = [[0, 0.77], [8, 0.54], [16, 0.61], [24, 0.57], [32, 0.5], [40, 0.59]];
  for (let index = 1; index < points.length; index += 1) {
    if (frame <= points[index][0]) {
      const [startFrame, startFocus] = points[index - 1];
      const [endFrame, endFocus] = points[index];
      return startFocus + (endFocus - startFocus) * (frame - startFrame) / (endFrame - startFrame);
    }
  }
  return points[points.length - 1][1];
};

export default function Hero({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const replay = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const replayTrigger = useRef<HTMLButtonElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);
  const [captionIndex, setCaptionIndex] = useState(-1);
  const [leadVisible, setLeadVisible] = useState(true);
  useEffect(() => {
    const section = root.current;
    const surface = canvas.current;
    if (!section || !surface || reduced) return;
    const frameCount = mobile ? MOBILE_FRAME_COUNT : FRAME_COUNT;
    const images: Array<HTMLImageElement | undefined> = Array(frameCount);
    const requested = new Set<number>();
    const queue = [0, ...Array.from({ length: frameCount }, (_, index) => index)];
    let targetFrame = 0;
    let drawnFrame = -1;
    let activeLoads = 0;
    let queuePosition = 0;
    let disposed = false;
    let raf = 0;
    let previousCaption = -1;
    let previousLead = true;
    const draw = () => {
      let index = targetFrame;
      if (!images[index]) {
        for (let offset = 1; offset < frameCount; offset += 1) {
          if (images[targetFrame - offset]) { index = targetFrame - offset; break; }
          if (images[targetFrame + offset]) { index = targetFrame + offset; break; }
        }
      }
      const image = images[index];
      if (!image || index === drawnFrame) return;
      const context = surface.getContext('2d', { alpha: false });
      if (!context) return;
      const bounds = surface.getBoundingClientRect();
      // The stills are 960×540 (720×405 on phones); a larger canvas only adds redraw cost.
      const pixelRatio = Math.min(window.devicePixelRatio || 1, image.naturalWidth / Math.max(1, bounds.width), image.naturalHeight / Math.max(1, bounds.height));
      const width = Math.max(1, Math.round(bounds.width * pixelRatio));
      const height = Math.max(1, Math.round(bounds.height * pixelRatio));
      if (surface.width !== width || surface.height !== height) { surface.width = width; surface.height = height; }
      const sourceRatio = image.naturalWidth / image.naturalHeight;
      const destinationRatio = width / height;
      let sx = 0, sy = 0, sw = image.naturalWidth, sh = image.naturalHeight;
      if (sourceRatio > destinationRatio) {
        sw = image.naturalHeight * destinationRatio;
        sx = mobile
          ? Math.max(0, Math.min(image.naturalWidth - sw, image.naturalWidth * mobileFocus(index) - sw / 2))
          : (image.naturalWidth - sw) * 0.5;
      } else {
        sh = image.naturalWidth / destinationRatio;
        sy = (image.naturalHeight - sh) * 0.5;
      }
      context.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
      surface.classList.add('is-ready');
      surface.dataset.frame = String(index);
      drawnFrame = index;
    };
    const pump = () => {
      while (activeLoads < 6 && queuePosition < queue.length) {
        const index = queue[queuePosition++];
        if (!requested.has(index)) load(index);
      }
    };
    const load = (index: number) => {
      if (requested.has(index) || disposed) return;
      requested.add(index);
      activeLoads += 1;
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => { activeLoads -= 1; if (disposed) return; images[index] = image; if (index === targetFrame || drawnFrame < 0) draw(); pump(); };
      image.onerror = () => { activeLoads -= 1; if (!disposed) pump(); };
      image.src = framePath(index, mobile);
    };
    const update = () => {
      raf = 0;
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const next = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance));
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${next})`;
      let nextCaption = -1;
      const chapterCaptions = mobile ? mobileCaptions : captions;
      for (let index = 0; index < chapterCaptions.length; index += 1) {
        if (next >= chapterCaptions[index].start) nextCaption = index;
      }
      if (nextCaption !== previousCaption) {
        previousCaption = nextCaption;
        setCaptionIndex(nextCaption);
      }
      const nextLead = next < 0.25;
      if (nextLead !== previousLead) {
        previousLead = nextLead;
        setLeadVisible(nextLead);
      }
      targetFrame = Math.round(Math.min(1, next / 0.98) * (frameCount - 1));
      if (!requested.has(targetFrame)) load(targetFrame);
      draw();
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const resize = () => { drawnFrame = -1; schedule(); };
    load(0);
    pump();
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, mobile]);

  const caption = captionIndex >= 0 ? (mobile ? mobileCaptions : captions)[captionIndex].text : undefined;
  const openReplay = () => { dialog.current?.showModal(); replay.current?.play().catch(() => {}); };
  const closeReplay = () => { replay.current?.pause(); dialog.current?.close(); replayTrigger.current?.focus(); };

  return <>
    <section className={`hero-story ${reduced ? 'is-reduced' : ''}`} id="top" ref={root} aria-label="OriginOrbit creative studio">
      <div className={`hero-stage ${leadVisible ? '' : 'has-progress'}`}>
        <div className="hero-media"><picture className="hero-poster"><source media="(max-width: 700px)" srcSet="/media/scroll-frames-mobile/000.jpg" /><img src="/media/poster-v4.webp" alt="A handmade clay astronaut digs on Mars beneath a dark sky" width="1920" height="1080" fetchPriority="high" /></picture>
        {!reduced && <canvas ref={canvas} className="hero-sequence" aria-hidden="true" />}</div>
        <div className="hero-shade" />
        <div className={`hero-lead ${reduced || leadVisible ? '' : 'is-hidden'}`} aria-hidden={!reduced && !leadVisible}>
          <span className="eyebrow">ORIGIN &amp; ORBIT — AI-NATIVE CREATIVE STUDIO</span>
          <h1>Ideas made<br />impossible to ignore</h1>
          <p>We create distinctive imagery, films, campaigns and interactive experiences for brands that want to stand apart.</p>
          <div className="hero-actions"><a className="button button-orange" href="#services">Explore services <Arrow /></a><a className="hero-secondary" href="/start-a-project/">Start a project <Arrow /></a></div>
        </div>
        {!reduced && caption && <p key={caption} className="film-caption">{caption}</p>}
        {!reduced && <div className="hero-progress" aria-hidden="true"><span ref={progressBar} style={{ transform: 'scaleX(0)' }} /></div>}
        {!reduced && <a className="skip-intro" href="#services">Skip intro <span aria-hidden="true">↓</span></a>}
      </div>
    </section>
    <div className="film-note"><span>AN ORIGINAL ORIGINORBIT FILM</span><button ref={replayTrigger} type="button" onClick={openReplay}>Play the film <span aria-hidden="true">↗</span></button></div>
    <dialog className="film-dialog" ref={dialog} aria-label="OriginOrbit astronaut film" onCancel={event => { event.preventDefault(); closeReplay(); }} onClick={event => { if (event.target === event.currentTarget) closeReplay(); }}><div className="dialog-top"><span>Good ideas take shape</span><button type="button" onClick={closeReplay}>Close ×</button></div><video ref={replay} src={FILM_DESKTOP} poster="/media/poster-v4.webp" controls playsInline preload="none" aria-label="A clay astronaut gathers material on Mars and shapes it into a flower in space" /><p>An original studio experiment by OriginOrbit.</p></dialog>
  </>;
}
