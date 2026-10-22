import { useRef, useState } from 'react';
import { FILM_DESKTOP, FILM_MOBILE } from './site-data';
import { Arrow, useMediaQuery } from './Shared';
import { FILM_CHAPTERS, useFilmSequence, type FilmStatus } from './useFilmSequence';

const POSTER = '/media/hero-v4/poster-desktop.webp';
export default function Hero({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const compact = useMediaQuery('(max-width: 700px), (max-width: 1000px) and (orientation: portrait)');
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const replay = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const replayTrigger = useRef<HTMLButtonElement>(null);
  const progressBar = useRef<HTMLSpanElement>(null);
  const [captionIndex, setCaptionIndex] = useState(-1);
  const [filmStatus, setFilmStatus] = useState<FilmStatus>('loading');
  useFilmSequence({ root, video, progressBar, reduced, onChapter: setCaptionIndex, onStatus: setFilmStatus });
  const leadVisible = reduced || captionIndex < 0;
  const openReplay = () => {
    dialog.current?.showModal();
    if (replay.current) {
      replay.current.src = compact ? FILM_MOBILE : FILM_DESKTOP;
      replay.current.play().catch(() => {});
    }
  };
  const closeReplay = () => { replay.current?.pause(); dialog.current?.close(); replay.current?.removeAttribute('src'); replay.current?.load(); replayTrigger.current?.focus(); };
  return <>
    <section className={`hero-story final-film ${reduced ? 'is-reduced' : ''}`} id="top" ref={root} aria-label="OriginOrbit creative studio">
      <div className={`hero-stage scene-${captionIndex} ${leadVisible ? '' : 'has-progress'}`}>
        <div className="hero-media">
          <picture className="hero-poster"><source media="(max-width: 700px), (max-width: 1000px) and (orientation: portrait)" srcSet="/media/hero-v4/poster-mobile.webp" /><img src={POSTER} alt="A handmade clay astronaut with OriginOrbit logo eyes gathers clay on Mars" width="1920" height="1080" fetchPriority="high" /></picture>
          {!reduced && <video ref={video} className="hero-film" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true">
            <source src={FILM_MOBILE} type="video/mp4" media="(prefers-reduced-motion: no-preference) and (max-width: 700px), (prefers-reduced-motion: no-preference) and (max-width: 1000px) and (orientation: portrait)" />
            <source src={FILM_DESKTOP} type="video/mp4" media="(prefers-reduced-motion: no-preference) and (min-width: 1001px), (prefers-reduced-motion: no-preference) and (min-width: 701px) and (orientation: landscape)" />
          </video>}
        </div>
        <div className="hero-shade" />
        <div className={`hero-lead ${leadVisible ? '' : 'is-hidden'}`} aria-hidden={!leadVisible} inert={!leadVisible}>
          <span className="eyebrow">ORIGIN &amp; ORBIT — AI-NATIVE CREATIVE STUDIO</span>
          <h1>Ideas made<br />impossible to ignore</h1>
          <p>We create distinctive imagery, films, campaigns and interactive experiences for brands that want to stand apart.</p>
          <div className="hero-actions"><a className="button button-orange" href="#services">Explore services <Arrow /></a><a className="hero-secondary" href="/start-a-project/">Start a project <Arrow /></a></div>
        </div>
        {!reduced && captionIndex >= 0 && <p key={captionIndex} className={`film-caption chapter-${captionIndex}`}>{FILM_CHAPTERS[captionIndex].text}</p>}
        {!reduced && <div className="hero-progress" aria-hidden="true"><span ref={progressBar} style={{ transform: 'scaleX(0)' }} /></div>}
        {!reduced && filmStatus === 'loading' && <span className="film-loading" role="status">Loading the film</span>}
        {!reduced && <a className="skip-intro" href="#services">Skip intro <span aria-hidden="true">↓</span></a>}
      </div>
    </section>
    <div className="film-note"><span>AN ORIGINAL ORIGINORBIT FILM</span><button ref={replayTrigger} type="button" onClick={openReplay}>Play the film <span aria-hidden="true">↗</span></button></div>
    <dialog className="film-dialog" ref={dialog} aria-label="OriginOrbit astronaut film" onCancel={event => { event.preventDefault(); closeReplay(); }} onClick={event => { if (event.target === event.currentTarget) closeReplay(); }}>
      <div className="dialog-top"><span>Every idea has an origin</span><button type="button" onClick={closeReplay}>Close ×</button></div>
      <video ref={replay} controls playsInline preload="none" aria-label="A clay astronaut gathers Mars clay, floats outside a closed space station and shapes a flower by hand" />
      <p>An original studio experiment by OriginOrbit</p>
    </dialog>
  </>;
}
