/* ═══════════════════════════════════════════════════════════════════════
   SINGLE SOURCE OF TRUTH — synced with Abderrahmane_Charak_CV (2026)
   Localised strings live in translations.ts under the keys referenced here.
═══════════════════════════════════════════════════════════════════════ */

/* ─── Identity ───────────────────────────────────────────────────────── */
export const identity = {
  first:     'Abderrahmane',
  last:      'Charak',
  name:      'Abderrahmane Charak',
  role:      'Software Engineer',
  location:  'Marrakech, Morocco',
  coords:    '31.6295°N - 7.9811°W',
  timezone:  'Africa/Casablanca',
  github:    'github.com/inrabderrahmane20-bot',
  githubUrl: 'https://github.com/inrabderrahmane20-bot',
};

/* ─── Contact ────────────────────────────────────────────────────────── */
export const contactData = {
  email:        'inr.abderrahmane.20@gmail.com',
  location:     'Marrakech, Morocco',
  phones:       ['+212 711 374 861'],
  whatsapp:     '212711374861',
  socials:      ['github.com/inrabderrahmane20-bot'],
  availability: 'Open to projects',
};

/* ─── Work Items ─────────────────────────────────────────────────────── */
export const workItems = [
  {
    slug: 'marrakech-privee',
    title: 'Marrakech Privée',
    titleKey: 'workItem.marrakech-privee.title',
    category: 'Web Experience',
    categoryKey: 'workItem.marrakech-privee.category',
    year: '2026',
    summaryKey: 'workItem.marrakech-privee.summary',
    stack: ['Next.js 15', 'GSAP', 'EN / FR / ES / DE'],
    metric: null,
    link: null,
    image: '/Marrakech_privee1.png',
    gallery: ['/Marrakech_privee2.png', '/Marrakech_privee3.png', '/Marrakech_privee4.png'],
  },
  {
    slug: 'crm',
    title: 'CRM Platform',
    titleKey: 'workItem.crm.title',
    category: 'Full-Stack',
    categoryKey: 'workItem.crm.category',
    year: '2026',
    summaryKey: 'workItem.crm.summary',
    stack: ['Next.js 14', 'NextAuth', 'MySQL / MariaDB'],
    metric: null,
    link: null,
    image: '/CRM1.png',
    gallery: ['/CRM2.png', '/CRM3.png', '/CRM4.png'],
  },
  {
    slug: 'select-emc',
    title: 'Select by EMC',
    titleKey: 'workItem.select-emc.title',
    category: 'Web Platform',
    categoryKey: 'workItem.select-emc.category',
    year: '2025',
    summaryKey: 'workItem.select-emc.summary',
    stack: ['Next.js', 'React', 'SEO', 'i18n'],
    metric: '~50 users / day',
    link: 'https://selectbyemc.com',
    image: '/select.png',
    gallery: ['/Select1.png', '/Select2.png', '/Select3.png'],
  },
  {
    slug: 'travel-to',
    title: 'Travel To…',
    titleKey: 'workItem.travel-to.title',
    category: 'Web Design',
    categoryKey: 'workItem.travel-to.category',
    year: '2025',
    summaryKey: 'workItem.travel-to.summary',
    stack: ['Next.js', 'Interactive Globe', 'Editorial UI'],
    metric: null,
    link: null,
    image: '/TravelTo.png',
    gallery: ['/Traveltto1.png', '/Traveltto2.png', '/Traveltto3.png'],
  },
  {
    slug: 'atlassia-rent',
    title: 'Atlassia Rent',
    titleKey: 'workItem.atlassia-rent.title',
    category: 'Full-Stack',
    categoryKey: 'workItem.atlassia-rent.category',
    year: '2025',
    summaryKey: 'workItem.atlassia-rent.summary',
    stack: ['Next.js', 'Node.js', 'FR / AR / EN'],
    metric: null,
    link: null,
    image: '/Atalssin1.png',
    gallery: ['/Atlassin2.png', '/Atlassin3.png', '/Atlassin4.png'],
  },
  {
    slug: 'riad-marrakech',
    title: 'Riad Marrakech',
    titleKey: 'workItem.riad-marrakech.title',
    category: 'Web Development',
    categoryKey: 'workItem.riad-marrakech.category',
    year: '2024',
    summaryKey: 'workItem.riad-marrakech.summary',
    stack: ['React', 'Booking UX', 'Mobile-first'],
    metric: null,
    link: null,
    image: '/Riad.png',
    gallery: ['/Riad.png'],
  },
  {
    slug: 'driving-school',
    title: 'Auto École',
    titleKey: 'workItem.driving-school.title',
    category: 'Web Design',
    categoryKey: 'workItem.driving-school.category',
    year: '2024',
    summaryKey: 'workItem.driving-school.summary',
    stack: ['Next.js', 'Local SEO', 'Conversion'],
    metric: null,
    link: null,
    image: '/Auto_ecole.png',
    gallery: ['/Auto_ecole1.png', '/Auto_ecole2.png'],
  },
];

export const featuredWork = workItems.slice(0, 4);

/* ─── Capabilities (Services) ────────────────────────────────────────── */
export const capabilities = [
  { num: '01', id: 'c01', tools: ['Next.js', 'React', 'TypeScript'] },
  { num: '02', id: 'c02', tools: ['Django', 'Flask', 'Node.js', 'REST'] },
  { num: '03', id: 'c03', tools: ['Figma', 'Design Systems', 'Motion'] },
  { num: '04', id: 'c04', tools: ['Python', 'NLP', 'TensorFlow'] },
];

/* ─── Professional Experience — CV verified ──────────────────────────── */
export const experienceItems = [
  {
    id: '212',
    org: '212 Communication',
    place: 'Marrakech',
    period: 'Apr 2025 - Jan 2026',
    roleKey: 'exp.212.role',
    descKey: 'exp.212.desc',
    stack: ['AngularJS', 'JavaScript', 'Cordova', 'Symfony', 'WordPress', 'jQuery'],
  },
  {
    id: 'ocp',
    org: 'OCP Group',
    place: 'Benguerir',
    period: 'Mar - Jul 2024',
    roleKey: 'exp.ocp.role',
    descKey: 'exp.ocp.desc',
    stack: ['Python', 'Flask', 'NLP', 'NLTK', 'TensorFlow', 'Spring', 'Node.js'],
  },
  {
    id: 'rma',
    org: 'RMA - Royale Marocaine d’Assurance',
    place: 'Marrakech',
    period: 'Jul - Sep 2023',
    roleKey: 'exp.rma.role',
    descKey: 'exp.rma.desc',
    stack: ['Django', 'React.js', 'AWS', 'MySQL'],
  },
  {
    id: 'geant',
    org: 'Géant Computer S.A.R.L. AU',
    place: 'Marrakech',
    period: 'Jul - Sep 2022',
    roleKey: 'exp.geant.role',
    descKey: 'exp.geant.desc',
    stack: ['Flutter', 'Java', 'Laravel', 'MySQL'],
  },
];

/* ─── Education — CV verified ────────────────────────────────────────── */
export const educationItems = [
  { id: 'emsi', year: '2024',        titleKey: 'edu.emsi.title', org: 'École Marocaine des Sciences de l’Ingénieur (EMSI)' },
  { id: 'cpge', year: '2018 - 2020', titleKey: 'edu.cpge.title', org: 'CPGE - Marrakech Prépas' },
  { id: 'bac',  year: '2018',        titleKey: 'edu.bac.title',  org: 'Lycée Al Omam - Marrakech' },
];

/* ─── Certifications — CV verified ───────────────────────────────────── */
export const certifications = [
  'Java for Android',
  'Android App Components',
  'Maintainable Android Apps',
];

/* ─── Core skills (CV skill bars) ────────────────────────────────────── */
export const coreSkills = [
  { label: 'JavaScript / TypeScript',   pct: 90 },
  { label: 'React / Next.js',           pct: 90 },
  { label: 'Python / Django / Flask',   pct: 90 },
  { label: 'UI / UX & Product Design',  pct: 90 },
];

/* ─── Tools & tech — CV verified ─────────────────────────────────────── */
export const toolsTech = [
  'Node.js', 'REST APIs', 'Java', 'Spring', 'Flutter', 'MySQL',
  'Symfony', 'Laravel', 'AngularJS', 'Cordova', 'AWS', 'TensorFlow',
  'NLP', 'Git', 'WordPress', 'Figma',
];

/* ─── Languages — CV verified ────────────────────────────────────────── */
export const languageSkills = [
  { label: 'Arabic',  levelKey: 'lang.native' },
  { label: 'English', levelKey: 'lang.fluent' },
  { label: 'French',  levelKey: 'lang.fluent' },
];

/* ─── Real, verifiable numbers (no invented awards) ──────────────────── */
export const ledgerFacts = [
  { value: '4',       labelKey: 'fact.companies' },
  { value: '2022',    labelKey: 'fact.since' },
  { value: '100–200', labelKey: 'fact.requests' },
  { value: '~50',     labelKey: 'fact.users' },
  { value: '16+',     labelKey: 'fact.tools' },
  { value: '3',       labelKey: 'fact.languages' },
];

/* ─── Clients (real only) ────────────────────────────────────────────── */
export const clients = [
  'OCP Group',
  'RMA Assurance',
  '212 Communication',
  'Géant Computer',
  'EMC - Select',
];

/* ─── Case Studies ───────────────────────────────────────────────────── */
export const caseStudyContent: Record<string, {
  titleKey: string; introKey: string; challengeKey: string;
  goalKey: string; processKey: string; resultKey: string;
}> = Object.fromEntries(
  workItems.map(w => [w.slug, {
    titleKey:     `cs.${w.slug}.title`,
    introKey:     `cs.${w.slug}.intro`,
    challengeKey: `cs.${w.slug}.challenge`,
    goalKey:      `cs.${w.slug}.goal`,
    processKey:   `cs.${w.slug}.process`,
    resultKey:    `cs.${w.slug}.result`,
  }]),
);
