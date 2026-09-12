export const WORK_DISCIPLINES = [
  { id: 'all', label: 'All' },
  { id: '3d-vfx', label: '3D & VFX' },
  { id: 'motion', label: 'Motion Design' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'editing', label: 'Editing & Post' },
];

export const WORK_DISCIPLINE_IDS = new Set(
  WORK_DISCIPLINES.filter(({ id }) => id !== 'all').map(({ id }) => id),
);

const DISCIPLINE_ALIASES = {
  '3d-vfx': [
    '3d',
    '3d vfx',
    'houdini',
    'maya',
    'blender',
    '3ds max',
    'cinema 4d',
    'substance painter',
  ],
  motion: [
    'aftereffects',
    'after effects',
    'premiere',
    'premiere pro',
    'motion',
    'motion design',
    'motion graphics',
  ],
  interactive: [
    'interactive',
    'react',
    'three.js',
    'threejs',
    'webgl',
    'javascript',
  ],
  editing: [
    'editing',
    'premiere',
    'premiere pro',
    'davinci resolve',
    'post production',
    'post-production',
  ],
};

export function normalizeWorkTerm(value) {
  if (typeof value !== 'string') return '';

  return value
    .normalize('NFKC')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .trim()
    .toLocaleLowerCase()
    .replace(/[._-]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function termKey(value) {
  return normalizeWorkTerm(value).replace(/\s+/g, '');
}

const disciplineAliasKeys = new Map(
  Object.entries(DISCIPLINE_ALIASES).map(([discipline, aliases]) => [
    discipline,
    new Set(aliases.map(termKey)),
  ]),
);

export function normalizeDisciplines(disciplines) {
  if (!Array.isArray(disciplines)) return [];

  return [...new Set(
    disciplines
      .map((discipline) => (
        typeof discipline === 'string'
          ? discipline.normalize('NFKC').trim().toLowerCase()
          : ''
      ))
      .filter((discipline) => WORK_DISCIPLINE_IDS.has(discipline)),
  )];
}

export function projectHasExplicitDisciplines(project) {
  return Array.isArray(project?.disciplines) && project.disciplines.length > 0;
}

function projectTerms(project) {
  return [...(project?.tags || []), ...(project?.arsenal || [])]
    .map((value) => (typeof value === 'string' ? value : value?.name))
    .map(termKey)
    .filter(Boolean);
}

export function inferDisciplines(project) {
  const values = new Set(projectTerms(project));

  return [...disciplineAliasKeys.entries()]
    .filter(([, aliases]) => [...aliases].some((alias) => values.has(alias)))
    .map(([discipline]) => discipline);
}

export function getProjectDisciplines(project) {
  if (projectHasExplicitDisciplines(project)) {
    return normalizeDisciplines(project.disciplines);
  }

  return inferDisciplines(project);
}

export function formatWorkLabel(value) {
  const normalized = normalizeWorkTerm(value);
  if (normalized === 'after effects') return 'After Effects';
  return typeof value === 'string' ? value.trim() : '';
}

export function findUnclassifiedProjects(projects) {
  return (Array.isArray(projects) ? projects : [])
    .filter((project) => getProjectDisciplines(project).length === 0)
    .map(({ _id, title }) => ({ id: _id || null, title: title || 'Untitled project' }));
}
