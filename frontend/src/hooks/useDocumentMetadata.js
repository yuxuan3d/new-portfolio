import { useEffect } from 'react';

const SITE_URL = 'https://www.yxperiments.com';
const DEFAULTS = {
  title: 'Yu Xuan — 3D Motion Designer | yxperiments',
  description: 'Yu Xuan is a 3D motion designer and interactive developer creating cinematic visuals and web experiences.',
  canonical: `${SITE_URL}/`,
  image: `${SITE_URL}/og-yxperiments.png`,
  imageAlt: 'Particle Earth hero for the yxperiments portfolio',
};

const META_SELECTORS = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:url"]',
  'meta[property="og:image"]',
  'meta[property="og:image:alt"]',
  'meta[property="og:type"]',
  'meta[name="twitter:card"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image"]',
  'meta[name="twitter:image:alt"]',
  'meta[name="robots"]',
  'link[rel="canonical"]',
];

function ensureElement(selector, tagName, attributes) {
  const matches = [...document.head.querySelectorAll(selector)];
  let element = matches.shift();
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }
  matches.forEach((duplicate) => duplicate.remove());
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function setMeta(attribute, key, content) {
  ensureElement(`meta[${attribute}="${key}"]`, 'meta', { [attribute]: key, content });
}

function snapshotHead() {
  return META_SELECTORS.map((selector) => ({
    selector,
    markup: [...document.head.querySelectorAll(selector)].map((element) => element.outerHTML),
  }));
}

function restoreHead(snapshot) {
  snapshot.forEach(({ selector, markup }) => {
    document.head.querySelectorAll(selector).forEach((current) => current.remove());
    markup.forEach((elementMarkup) => {
      const template = document.createElement('template');
      template.innerHTML = elementMarkup;
      const restored = template.content.firstElementChild;
      if (restored) document.head.appendChild(restored);
    });
  });
}

export function toCanonicalUrl(pathname = '/') {
  return new URL(pathname, SITE_URL).toString();
}

export default function useDocumentMetadata({
  title = DEFAULTS.title,
  description = DEFAULTS.description,
  canonical = DEFAULTS.canonical,
  image = DEFAULTS.image,
  imageAlt = DEFAULTS.imageAlt,
  type = 'website',
  noIndex = false,
} = {}) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousHead = snapshotHead();
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:image:alt', imageAlt);

    if (canonical) {
      ensureElement('link[rel="canonical"]', 'link', { rel: 'canonical', href: canonical });
      setMeta('property', 'og:url', canonical);
      setMeta('property', 'og:image', image);
      setMeta('property', 'og:image:alt', imageAlt);
    } else {
      document.head.querySelectorAll('link[rel="canonical"], meta[property="og:url"], meta[property="og:image"], meta[property="og:image:alt"]').forEach((element) => element.remove());
    }

    if (noIndex) setMeta('name', 'robots', 'noindex, nofollow');
    else document.head.querySelectorAll('meta[name="robots"]').forEach((element) => element.remove());

    return () => {
      document.title = previousTitle;
      restoreHead(previousHead);
    };
  }, [canonical, description, image, imageAlt, noIndex, title, type]);
}

export { DEFAULTS as DOCUMENT_METADATA_DEFAULTS };
