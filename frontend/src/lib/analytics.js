const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let posthogPromise;

function getPostHog() {
  if (typeof window === 'undefined' || !POSTHOG_KEY) {
    return Promise.resolve(null);
  }

  if (!posthogPromise) {
    posthogPromise = import('posthog-js/dist/module.no-external')
      .then(({ default: posthog }) => {
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          autocapture: false,
          capture_pageview: false,
          disable_session_recording: true,
          person_profiles: 'identified_only',
        });

        return posthog;
      })
      .catch(() => null);
  }

  return posthogPromise;
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
  void getPostHog();
}

export function trackEvent(eventName, properties = {}) {
  if (!eventName) return;

  void getPostHog().then((posthog) => {
    if (!posthog) return;

    posthog.capture(eventName, cleanProperties(properties));
  });
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
