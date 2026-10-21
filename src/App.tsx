import { useEffect } from 'react';
import Hero from './Hero';
import Services from './Services';
import SecondaryPage from './SecondaryPage';
import { Approach, Contact, PointOfView, Studio } from './Sections';
import { Footer, Header, useMediaQuery } from './Shared';

function Home() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const mobile = useMediaQuery('(max-width: 700px)');
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = requestAnimationFrame(() => {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      requestAnimationFrame(() => { root.style.scrollBehavior = previous; });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <><a className="skip-link" href="#services">Skip to what we create</a><Header /><main><Hero reduced={reduced} mobile={mobile} /><Services reduced={reduced} /><PointOfView /><Approach reduced={reduced} /><Studio /><Contact /></main><Footer /></>;
}

export default function App({ pathOverride }: { pathOverride?: string }) {
  const path = (pathOverride ?? (typeof window !== 'undefined' ? window.location.pathname : '/')).replace(/\/$/, '');
  if (path === '/start-a-project') return <SecondaryPage kind="project" />;
  if (path === '/book-a-call') return <SecondaryPage kind="booking" />;
  return <Home />;
}
