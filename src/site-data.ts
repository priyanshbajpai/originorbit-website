export const CONTACT_EMAIL = 'contact@originorbit.studio';
export const PROJECT_FORM_URL = 'https://forms.gle/2AEPuZ9GTGucZqdc8';
export const PROJECT_FORM_EMBED = 'https://docs.google.com/forms/d/e/1FAIpQLSd34SvK3Iuel89PtjCPXaPWFEy5wZg5jAw321R4wJkimVZJIQ/viewform?embedded=true';
export const BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ204E6nelUbcxVY5LtaTYkGAaJwxGYyBYKeYv5wyHpWt64UJOQnqMGUf1fptEV5uOnT0stExPx3?gv=true';
export const FILM_DESKTOP = '/media/hero-v4/desktop.mp4';
export const FILM_MOBILE = '/media/hero-v4/mobile.mp4';

export const services = [
  {
    title: 'Images & Visual Worlds', short: 'Images', art: 'worlds', theme: 'images',
    line: 'Make your brand impossible to mistake.',
    description: 'From striking product imagery to imaginative visual worlds, we create distinctive images built around your brand’s story and identity.',
    deliverables: ['Product imagery', 'Campaign visuals', 'Editorial imagery', 'Visual concepts'],
    alt: 'Handmade cream clay arch framing an orange sculptural flower with a cobalt centre',
  },
  {
    title: 'Films & Motion', short: 'Films', art: 'films', theme: 'films',
    line: 'Stories worth stopping for.',
    description: 'Cinematic brand films, animated stories, launch teasers and social motion made to capture attention and leave an impression.',
    deliverables: ['Brand films', 'Product films', 'Social motion', 'Launch teasers'],
    alt: 'Handmade cream clay film camera with cobalt and orange reels',
  },
  {
    title: 'Interactive Experiences', short: 'Interactive', art: 'stories', theme: 'interactive',
    line: 'Make the audience part of the story.',
    description: 'Creative websites, digital experiences and playful interfaces that change how people explore and engage with brands.',
    deliverables: ['Creative websites', 'Interactive microsites', 'Digital storytelling', 'Web experiences'],
    alt: 'Handmade cream and cobalt clay screen with an orange ribbon emerging from it',
  },
  {
    title: 'Campaigns & Creative Direction', short: 'Campaigns', art: 'direction', theme: 'campaigns',
    line: 'One idea. Every expression working together.',
    description: 'We shape the central creative thought, then carry it through visuals, motion, digital experiences and brand communications.',
    deliverables: ['Creative concepts', 'Art direction', 'Campaign development', 'Multi-format creative'],
    alt: 'Handmade cream clay compass with an orange arrow and cobalt markers',
  },
] as const;

export const steps = [
  { number: '01', title: 'Discover', icon: 'understand', text: 'We understand your brand, your audience and the creative challenge worth solving.' },
  { number: '02', title: 'Direct', icon: 'define', text: 'We explore concepts, establish a visual direction and develop the idea that best fits your goals.' },
  { number: '03', title: 'Create', icon: 'create', text: 'We bring the direction to life through visuals, films, digital experiences or connected creative work.' },
  { number: '04', title: 'Deliver', icon: 'deliver', text: 'We refine, finalize and prepare the work for its intended platforms, formats and audiences.' },
] as const;
