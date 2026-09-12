// Stable editorial selections; all content and destinations still resolve from Sanity.
export const HERO_PROJECTS = [
  { id: '7cbc83f8-b6dd-4ba0-8345-4d74de7530fe', short: 'SIT', role: 'Art direction · 3D · Character animation',
    summary: 'Art direction, characters and a campus built for exploration.',
    image: 'image-51afde07df8421194186f86a7b061e19b37441eb-1920x1080-png' },
  { id: '76792a18-7e92-45e9-b4a7-854304deee3f', short: 'JPM', role: 'Storyboards · 3D · Post-production',
    summary: 'From the first storyboard to the final frame.',
    image: 'image-ea495433d01714c174f7f534bcb617b7c69ac3e9-1920x1080-jpg', rect: [800, 60, 1100, 619] },
  { id: '13f2854e-b7b9-4dd6-81d7-ae7db468f09b', short: 'Cinder', role: 'Team leadership · Real-time mocap',
    image: 'image-6cb458474016f4b556f7de38ba5798f4b979bfef-350x350-jpg',
    companion: 'image-be8828d4785d430e30f16b4be57141c6abf1d844-500x500-jpg' },
];

export function imageReference(image) {
  return image?.asset?._ref || image?.asset?._id || '';
}

export function imageDimensions(image) {
  const match = /-(\d+)x(\d+)-[a-z0-9]+$/i.exec(imageReference(image));
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

export function selectHeroProjects(projects = []) {
  const valid = projects.filter((p) => p?._id && typeof p.slug === 'string' && p.slug.trim() && p.title);
  const unique = [...new Map(valid.map((p) => [p._id, p])).values()];
  const selected = HERO_PROJECTS.map((config) => unique.find((p) => p._id === config.id)).filter(Boolean);
  return [...selected, ...unique.filter((p) => !selected.some((s) => s._id === p._id))].slice(0, 3);
}

export function heroPresentation(project) {
  const config = HERO_PROJECTS.find((p) => p.id === project?._id);
  const images = [project?.mainImage, ...(project?.additionalImages || [])].filter(Boolean);
  const preferred = images.find((image) => imageReference(image) === config?.image);
  const companion = images.find((image) => imageReference(image) === config?.companion);
  return {
    tone: config?.short === 'JPM' ? 'amber' : config?.short === 'Cinder' ? 'plum' : 'teal',
    short: config?.short || project?.title || 'Project',
    role: config?.role || 'Selected portfolio work',
    summary: config?.summary,
    image: preferred || project?.mainImage,
    companion: preferred ? companion : undefined,
    paired: Boolean(preferred && config?.companion),
    contained: !preferred || Boolean(config?.companion),
    rect: preferred ? config?.rect : undefined,
  };
}

export function projectPath(project) {
  return `/project/${encodeURIComponent(project.slug)}`;
}

export function wrapSlide(index, count) {
  return count ? ((index % count) + count) % count : 0;
}
