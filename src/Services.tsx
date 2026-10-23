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
    const stage = section.querySelector<HTMLElement>('.services-stage');
    if (!stage) return;
    let raf = 0, start = 0, distance = 1, visible = false;
    let previousVisible = -1;
    const update = () => {
      raf = 0;
      if (!visible) return;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / distance));
      // Each incoming opaque card slides over the previous one; text never
      // crossfades over other text. Only compositor transforms change on scroll.
      const last = services.length - 1;
      const position = Math.max(0, Math.min(last, (progress - .1) * last / .8));
      const current = Math.floor(position);
      const phase = position - current;
      cards.current.forEach((card, index) => {
        if (!card) return;
        const y = index <= current ? 0 : index === current + 1 ? (1 - phase) * 100 : 100;
        card.style.transform = `translate3d(0,${y}%,0)`;
        card.style.visibility = index === current || index === current + 1 ? 'visible' : 'hidden';
      });
      const selected = Math.min(last, current + (phase >= .5 ? 1 : 0));
      if (selected !== previousVisible) { previousVisible = selected; setActive(selected); }
    };
    const schedule = () => { if (!raf && visible) raf = requestAnimationFrame(update); };
    const measure = () => {
      start = section.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(stage).top || '0');
      distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(section); resize.observe(stage);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) { measure(); schedule(); }
    }, { rootMargin: '200px' });
    intersection.observe(section);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf); resize.disconnect(); intersection.disconnect();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure);
      cards.current.forEach(card => { if (card) { card.style.transform = ''; card.style.visibility = ''; } });
    };
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
    const progress = index === 0 ? .05 : index === services.length - 1 ? .95 : .1 + index * .8 / (services.length - 1);
    window.scrollTo({ top: top - parseFloat(getComputedStyle(stage).top || '0') + distance * progress, behavior: 'smooth' });
  };

  return <section className="services-section" id="services" aria-label="What OriginOrbit creates">
    <div className="services-scroll" ref={region}>
      <div className="services-stage">
        <div className="service-rail">
          <div className="service-intro"><span className="eyebrow">WHAT WE CREATE</span><BrandMark tone="dark" className="service-mark" /><h2>One idea<br /><em>Many expressions</em></h2><p>From a single image to an interactive experience or a repeatable creative workflow, we find the right form for the idea.</p></div>
          <div className="service-index" role="group" aria-label="Choose a service">{services.map((service, index) => <button key={service.title} type="button" className={active === index ? 'is-active' : ''} onClick={() => goTo(index)} aria-pressed={active === index}><span>0{index + 1}</span><strong>{service.title}</strong><Arrow diagonal={false} /></button>)}</div>
          <span className="rail-hint">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
        </div>
        <div className="service-deck">
          {services.map((service, index) => <article key={service.title} data-index={index} ref={node => { cards.current[index] = node; }} className={`service-panel panel-${service.theme} ${active === index ? 'is-active' : ''} ${openService === index ? 'is-mobile-open' : ''}`} aria-hidden={pinned && !reduced && active !== index} inert={pinned && !reduced && active !== index}>
            <button className="panel-top" type="button" aria-expanded={compact ? openService === index : undefined} aria-controls={`service-details-${index}`} onClick={() => { if (compact) setOpenService(previous => previous === index ? null : index); else if (pinned && !reduced) goTo(index); else setActive(index); }}><span>0{index + 1} / 0{services.length}</span><span><span className="panel-top-short">{service.short}</span><span className="panel-top-full">{service.title}</span> <Arrow /></span></button>
            <div className="panel-details" id={`service-details-${index}`} inert={compact && openService !== index}><div className="panel-details-inner">
              <div className="panel-body"><div className="panel-copy"><h3>{service.title}</h3><p className="panel-line">{service.line}</p><p className="panel-description">{service.description}</p></div><Clay name={service.art} alt={service.alt} className="panel-art" loading="eager" /></div>
              <div className="panel-bottom"><span>WHAT WE CAN MAKE</span><ul>{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul></div>
            </div></div>
          </article>)}
        </div>
      </div>
    </div>
    <div className="service-outro"><p>Have something in mind? <strong>Let’s create it</strong></p><a className="button button-ink" href="/start-a-project/">Start a project <Arrow /></a></div>
    <div className="partnership"><span className="eyebrow">ONGOING CREATIVE PARTNERSHIP</span><h3>Not just one project<br />A creative partner</h3><p>For brands that need support beyond a single campaign, we can create ongoing content, guide launches and build creative workflows that keep every new asset on direction.</p><a className="text-link" href="/start-a-project/">Discuss a partnership <Arrow /></a></div>
  </section>;
}
