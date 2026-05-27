const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
const DISTINCT_ID_STORAGE_KEY = 'yxperiments_posthog_distinct_id';

function getCaptureEndpoint() {
  return `${POSTHOG_HOST.replace(/\/$/, '')}/e/`;
}

function createDistinctId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDistinctId() {
  if (typeof window === 'undefined') {
    return createDistinctId();
  }

  try {
    const existingId = window.localStorage.getItem(DISTINCT_ID_STORAGE_KEY);
    if (existingId) return existingId;

    const nextId = createDistinctId();
    window.localStorage.setItem(DISTINCT_ID_STORAGE_KEY, nextId);
    return nextId;
  } catch {
    return createDistinctId();
  }
}

function cleanProperties(properties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    )),
  );
}

export function initAnalytics() {
  if (!POSTHOG_KEY || typeof window === 'undefined') return;

  getDistinctId();
}

export function trackEvent(eventName, properties = {}) {
  if (!POSTHOG_KEY || !eventName || typeof window === 'undefined') return;

  const currentUrl = new URL(window.location.href);
  const payload = {
    api_key: POSTHOG_KEY,
    event: eventName,
    properties: {
      distinct_id: getDistinctId(),
      token: POSTHOG_KEY,
      $current_url: currentUrl.href,
      $host: currentUrl.host,
      $pathname: currentUrl.pathname,
      ...cleanProperties(properties),
    },
    timestamp: new Date().toISOString(),
  };

  window.fetch(getCaptureEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: 'omit',
  }).catch(() => {});
}

export function trackProjectOpen(project, source, properties = {}) {
  const slug = typeof project?.slug === 'string' ? project.slug : '';
  if (!slug) return;

  trackEvent('project_opened', {
    slug,
    title: typeof project?.title === 'string' ? project.title : slug,
    source,
    ...properties,
  });
}
