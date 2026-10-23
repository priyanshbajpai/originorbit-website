import { useEffect, useState } from 'react';
import { CONTACT_EMAIL } from './site-data';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={diagonal ? 'M5 19 19 5M7 5h12v12' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Logo({ large = false }: { large?: boolean }) {
  if (large) return <span className="footer-logo-switch" aria-hidden="true"><img className="brand-logo brand-logo-large" src="/brand/svg/originorbit-wordmark-light.svg" width="942" height="213" alt="" decoding="async" /><img className="brand-logo brand-logo-large" src="/brand/svg/originorbit-wordmark-clay.svg" width="942" height="213" alt="" decoding="async" /></span>;
  return <span className="logo-switch" aria-hidden="true">
    <picture className="logo-light"><source media="(max-width: 700px)" srcSet="/brand/svg/originorbit-wordmark-compact-light.svg" /><img className="brand-logo" src="/brand/svg/originorbit-wordmark-light.svg" width="942" height="213" alt="" decoding="async" /></picture>
    <picture className="logo-dark"><source media="(max-width: 700px)" srcSet="/brand/svg/originorbit-wordmark-compact-dark.svg" /><img className="brand-logo" src="/brand/svg/originorbit-wordmark-dark.svg" width="942" height="213" alt="" decoding="async" /></picture>
  </span>;
}

export function BrandMark({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light' | 'clay'; className?: string }) {
  return <img className={`brand-mark ${className}`} src={`/brand/svg/originorbit-mark-${tone}.svg`} width="112" height="112" alt="" aria-hidden="true" loading="lazy" decoding="async" />;
}

export function Clay({ name, alt, className = '', loading = 'lazy' }: { name: string; alt: string; className?: string; loading?: 'lazy' | 'eager' }) {
  return <img className={`clay-art ${className}`} src={`/clay/${name}.webp`} width="960" height="960" alt={alt} loading={loading} decoding="async" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<'dark' | 'light' | 'clay'>('dark');
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);
  useEffect(() => {
    let raf = 0;
    const regions = '.hero-story, .film-note, .services-scroll, .service-outro, .partnership, .point-of-view, .approach, .studio-section, .contact-section, .secondary-hero, .embed-section, .secondary-end, .site-footer';
    const sections = Array.from(document.querySelectorAll<HTMLElement>(regions));
    let bounds: { section: HTMLElement; top: number; bottom: number }[] = [];
    const update = () => {
      raf = 0;
      let next: 'dark' | 'light' | 'clay' = 'dark';
      const position = window.scrollY + 36;
      for (const { section, top, bottom } of bounds) {
        if (top <= position && bottom > position) {
          if (section.matches('.services-scroll, .service-outro, .point-of-view, .studio-section, .embed-section, .secondary-end')) next = 'light';
          if (section.matches('.contact-section')) next = 'clay';
          break;
        }
      }
      setTone(current => current === next ? current : next);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const measure = () => {
      bounds = sections.map(section => {
        const box = section.getBoundingClientRect();
        return { section, top: box.top + window.scrollY, bottom: box.bottom + window.scrollY };
      });
      schedule();
    };
    const resize = new ResizeObserver(measure);
    sections.forEach(section => resize.observe(section));
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(raf); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); };
  }, []);
  const links = [
    ['Home', '/#top'], ['What We Create', '/#services'], ['Our Approach', '/#approach'],
    ['Studio', '/#studio'], ['Contact', '/#contact'],
  ];
  return <header className="site-header" data-tone={tone}>
    <a className="brand-link" href="/#top" aria-label="Origin & Orbit home"><Logo /></a>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(value => !value)}>{open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '×' : '+'}</span></button>
    <nav className={open ? 'site-nav is-open' : 'site-nav'} id="site-navigation" aria-label="Main navigation">
      {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-book" href="/book-a-call/" onClick={() => setOpen(false)}>Book a free call</a>
      <a className="nav-project" href="/start-a-project/" onClick={() => setOpen(false)}>Start a project <Arrow /></a>
    </nav>
  </header>;
}

export function Footer() {
  return <footer className="site-footer"><a href="/#top" aria-label="Origin & Orbit home"><Logo large /></a><div><span>Independent creative studio · India / Worldwide</span><nav aria-label="Footer navigation"><a href="/#services">What we create</a><a href="/#studio">Studio</a><a href="/start-a-project/">Start a project</a><a href="/book-a-call/">Book a call</a><a href={`mailto:${CONTACT_EMAIL}`}>Email</a></nav><a href="/#top">Back to top ↑</a></div><BrandMark tone="clay" className="footer-mark" /></footer>;
}
