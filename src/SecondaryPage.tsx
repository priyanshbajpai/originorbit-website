import { useEffect } from 'react';
import { BOOKING_URL, CONTACT_EMAIL, PROJECT_FORM_EMBED, PROJECT_FORM_URL } from './site-data';
import { Arrow, Footer, Header } from './Shared';

export default function SecondaryPage({ kind }: { kind: 'project' | 'booking' }) {
  const project = kind === 'project';
  useEffect(() => { document.title = project ? 'Start a Project — Origin & Orbit' : 'Book a Call — Origin & Orbit'; }, [project]);
  return <>
    <a className="skip-link" href="#page-content">Skip to content</a><Header />
    <main className="secondary-page" id="page-content">
      <section className="secondary-hero"><span className="eyebrow">{project ? 'START A PROJECT' : 'LET’S TALK'}</span><h1>{project ? 'Tell us what you’re imagining' : 'Great ideas start with a conversation'}</h1><p>{project ? 'An idea, a challenge or a few lines about what you’re building is enough to get started. Complete the enquiry form below, and we’ll review what you have in mind.' : 'Have a project in mind, need a creative perspective or want to explore what’s possible for your brand? Book an introductory conversation with Priyansh.'}</p><div className="secondary-actions"><a className="button button-orange" href={project ? PROJECT_FORM_URL : BOOKING_URL} target="_blank" rel="noopener noreferrer">{project ? 'Open the enquiry form' : 'Open booking calendar'} <Arrow /></a><a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>Email us instead <Arrow /></a></div></section>
      <section className={`embed-section ${project ? 'form-embed' : 'booking-embed'}`} aria-label={project ? 'Project enquiry form' : 'Appointment calendar'}><div className="embed-heading"><span>{project ? 'THE ENQUIRY FORM' : 'CHOOSE A TIME'}</span><p>{project ? 'The form is hosted by Google Forms. Its own confirmation appears after you submit.' : 'Current availability is shown by Google Calendar.'}</p></div><iframe src={project ? PROJECT_FORM_EMBED : BOOKING_URL} title={project ? 'Origin & Orbit project enquiry form' : 'Book a call with Priyansh at Origin & Orbit'} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /><a className="embed-mobile-link text-link" href={project ? PROJECT_FORM_URL : BOOKING_URL} target="_blank" rel="noopener noreferrer">{project ? 'Open the Google Form' : 'Open the booking calendar'} <Arrow /></a></section>
      <div className="secondary-end"><a href="/">← Back to the studio</a><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>
    </main><Footer />
  </>;
}
