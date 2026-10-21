import { useEffect, useRef, useState } from 'react';
import { services } from './site-data';
import { Arrow, BrandMark, Clay, useMediaQuery } from './Shared';

export default function Services({ reduced }: { reduced: boolean }) {
  const region = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const pinned = useMediaQuery('(min-width: 760px) and (min-height: 650px)');
  const compact = useMediaQuery('(max-width: 700px)');
  const [active, setActive] = useState(0);
  const [openService, setOpenService] = useState<number | null>(null);

  useEffect(() => {
    if (!pinned || reduced) return;
    const section = region.current;
    if (!section) return;
    let raf = 0;
    let previousVisible = -1;
    let previousProgress = -1;
    const transitions = [0.19, 0.43, 0.67];
    const transitionLength = 0.07;
    const update = () => {
      raf = 0;
      const stage = section.querySelector<HTMLElement>('.services-stage');
      if (!stage) return;
      const distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
      const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance));
      if (progress === previousProgress) return;
      previousProgress = progress;
      let current = 0;
      let next = 0;
      let fade = 0;
      for (const [index, start] of transitions.entries()) {
        if (progress >= start + transitionLength) { current = index + 1; next = current; }
        else if (progress >= start) {
          current = index;
          next = index + 1;
          const phase = (progress - start) / transitionLength;
          fade = phase * phase * (3 - 2 * phase);
          break;
        } else break;
      }
      cards.current.forEach((card, index) => {
        if (!card) return;
        const opacity = index === current ? 1 - fade : index === next ? fade : 0;
        const opacityValue = String(opacity);
        if (card.style.opacity !== opacityValue) card.style.opacity = opacityValue;
        const visibility = opacity > 0.001 ? 'visible' : 'hidden';
        if (card.style.visibility !== visibility) card.style.visibility = visibility;
        const zIndex = String(index === next ? 2 : 1);
        if (card.style.zIndex !== zIndex) card.style.zIndex = zIndex;
      });
      const visible = fade >= 0.5 ? next : current;
      if (visible !== previousVisible) { previousVisible = visible; setActive(visible); }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cards.current.forEach(card => { if (card) { card.style.opacity = ''; card.style.visibility = ''; card.style.zIndex = ''; } }); };
  }, [pinned, reduced]);

  useEffect(() => {
    if (pinned || compact || reduced) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.index));
    }, { rootMargin: '-20% 0px -45% 0px', threshold: [0, 0.25, 0.5] });
    cards.current.forEach(card => { if (card) observer.observe(card); });
    return () => observer.disconnect();
  }, [pinned, compact, reduced]);

  const goTo = (index: number) => {
    if (!pinned || reduced) { cards.current[index]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); return; }
    const section = region.current;
    if (!section) return;
    const top = window.scrollY + section.getBoundingClientRect().top;
    const stage = section.querySelector<HTMLElement>('.services-stage');
    if (!stage) return;
    const distance = Math.max(0, section.offsetHeight - stage.offsetHeight);
    const destinations = [0.06, 0.32, 0.56, 0.84];
    window.scrollTo({ top: top + distance * destinations[index], behavior: 'smooth' });
  };

  return <section className="services-section" id="services" aria-label="What OriginOrbit creates">
    <div className="services-scroll" ref={region}>
      <div className="services-stage">
        <div className="service-rail">
          <div className="service-intro"><span className="eyebrow">WHAT WE CREATE</span><BrandMark tone="dark" className="service-mark" /><h2>One idea<br /><em>Many expressions</em></h2><p>From one striking image to an entire interactive experience, we bring ideas to life in the forms that serve them best.</p></div>
          <div className="service-index" role="group" aria-label="Choose a service">{services.map((service, index) => <button key={service.title} type="button" className={active === index ? 'is-active' : ''} onClick={() => goTo(index)} aria-pressed={active === index}><span>0{index + 1}</span><strong>{service.title}</strong><Arrow diagonal={false} /></button>)}</div>
          <span className="rail-hint">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
        </div>
        <div className="service-deck">
          {services.map((service, index) => <article key={service.title} data-index={index} ref={node => { cards.current[index] = node; }} className={`service-panel panel-${service.theme} ${active === index ? 'is-active' : ''} ${openService === index ? 'is-mobile-open' : ''}`} aria-hidden={pinned && !reduced && active !== index} inert={pinned && !reduced && active !== index}>
            <button className="panel-top" type="button" aria-expanded={compact ? openService === index : undefined} aria-controls={`service-details-${index}`} onClick={() => { if (compact) setOpenService(previous => previous === index ? null : index); else if (pinned && !reduced) goTo(index); else setActive(index); }}><span>0{index + 1} / 04</span><span><span className="panel-top-short">{service.short}</span><span className="panel-top-full">{service.title}</span> <Arrow /></span></button>
            <div className="panel-details" id={`service-details-${index}`} inert={compact && openService !== index}><div className="panel-details-inner">
              <div className="panel-body"><div className="panel-copy"><h3>{service.title}</h3><p className="panel-line">{service.line}</p><p className="panel-description">{service.description}</p></div><Clay name={service.art} alt={service.alt} className="panel-art" loading="eager" /></div>
              <div className="panel-bottom"><span>WHAT WE CAN MAKE</span><ul>{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul></div>
            </div></div>
          </article>)}
        </div>
      </div>
    </div>
    <div className="service-outro"><p>Have something in mind? <strong>Let’s create it</strong></p><a className="button button-ink" href="/start-a-project/">Start a project <Arrow /></a></div>
    <div className="partnership"><span className="eyebrow">ONGOING CREATIVE PARTNERSHIP</span><h3>Not just one project<br />A creative partner</h3><p>For brands that need support beyond a single campaign, we can collaborate across ongoing content, launches and evolving brand needs.</p><a className="text-link" href="/start-a-project/">Discuss a partnership <Arrow /></a></div>
  </section>;
}
