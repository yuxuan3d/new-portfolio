import { EXTERNAL_LINKS, SOCIAL_LINKS } from '../constants/social';

export const HOME_NAV_ITEMS = [
  { label: 'Home', id: 'home', kind: 'section', to: '/' },
  { label: 'Resume', id: 'resume', kind: 'section', to: '/#resume' },
  { label: 'Works', id: 'works', kind: 'section', to: '/#works' },
  { label: 'Blog', id: 'blog', kind: 'route', to: '/rnd' },
  { label: 'Contact', id: 'contact', kind: 'section', to: '/#contact' },
];

export const HERO_CONTENT = {
  eyebrow: 'Yu Xuan / Motion + Interactive Direction',
  displayTitle: 'I build cinematic worlds.',
  title: 'Motion-first systems and tactile web experiences.',
  subtitle:
    'I design and build portfolio films, real-time visuals, and interactive web pieces that merge VFX craft with production-ready frontend execution.',
  primaryCta: {
    label: 'View Resume',
    href: EXTERNAL_LINKS.RESUME,
  },
  secondaryCta: {
    label: 'Open R&D Journal',
    to: '/rnd',
  },
  tertiaryCta: {
    label: 'Jump to Works',
    id: 'works',
  },
};

export const RESUME_CONTENT = {
  eyebrow: 'Resume',
  title: 'About',
  intro:
    'I build cinematic 3D, motion, and interactive work with a strong production mindset.',
  description:
    'My work covers Houdini simulations, 3D look-dev, motion graphics, post-production, VFX cleanup, and web implementation with React and Three.js. The focus is simple: make ambitious visuals look sharp, clear, and ready to ship.',
  actions: [
    {
      label: 'Watch Demo Reel',
      href: EXTERNAL_LINKS.DEMO_REEL,
    },
    {
      label: 'Download Resume',
      href: EXTERNAL_LINKS.RESUME,
    },
  ],
};

export const RESUME_STATS = [
  { label: '3D + VFX', value: 'Simulation, look-dev, and visual effects' },
  { label: 'Motion', value: 'Brand, campaign, and editorial motion' },
  { label: 'React + Three.js', value: 'Interactive websites and WebGL work' },
];

export const WORKFLOW_PHASES = [
  {
    step: '01',
    title: 'Discover',
    description: 'Clarify the goal, references, and production scope.',
  },
  {
    step: '02',
    title: 'Prototype',
    description: 'Develop the visual system, motion, and technical foundation.',
  },
  {
    step: '03',
    title: 'Polish',
    description: 'Polish the work, solve delivery details, and prep for launch.',
  },
];

export const CAPABILITY_CARDS = [
  {
    title: '3D & Visual Effects',
    description:
      'High-fidelity 3D assets, simulation, and look-dev for visuals that feel cinematic and production-ready.',
    tools: ['Houdini', '3ds Max', 'Maya', 'Blender', 'Substance Painter'],
  },
  {
    title: 'Motion Graphics & Production',
    description:
      '2D and 3D motion design for campaigns, reels, title work, and editorial content.',
    tools: ['After Effects', 'Premiere Pro', 'Photoshop'],
  },
  {
    title: 'Interactive Development',
    description:
      'Production-minded frontend work for immersive websites, WebGL scenes, and interactive experiences..',
    tools: ['React', 'Three.js', 'Node.js', 'Python', 'Creative AI Tools'],
  },
];

export const WORKS_CONTENT = {
  title: 'Work',
};

export const BLOG_CONTENT = {
  title: 'Blog',
};

export const CONTACT_CONTENT = {
  title: 'Contact',
  contactMethods: [
    {
      label: 'Email',
      value: SOCIAL_LINKS.EMAIL,
      href: `mailto:${SOCIAL_LINKS.EMAIL}`,
    },
    {
      label: 'LinkedIn',
      value: 'LinkedIn',
      href: SOCIAL_LINKS.LINKEDIN,
    },
    {
      label: 'Instagram',
      value: 'Instagram',
      href: SOCIAL_LINKS.INSTAGRAM,
    },
  ],
};
