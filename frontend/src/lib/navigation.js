export const HOME_SECTION_IDS = new Set(['home', 'awards', 'works', 'field-notes', 'resume', 'contact']);

export function getSafeSectionHash(hash) {
  if (typeof hash !== 'string' || !hash.startsWith('#') || hash.length < 2) return null;

  try {
    const id = decodeURIComponent(hash.slice(1));
    return HOME_SECTION_IDS.has(id) ? id : null;
  } catch {
    return null;
  }
}
