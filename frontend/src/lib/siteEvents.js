// Tracking is optional: a blocked module must never prevent the site rendering.
// Keep the original analytics URL so content blockers remain effective.
let analyticsModule;

function dispatch(method, args) {
  analyticsModule ??= import('./analytics').catch(() => null);
  void analyticsModule.then((module) => module?.[method](...args)).catch(() => {});
}

export const initAnalytics = (...args) => dispatch('initAnalytics', args);
export const trackPageView = (...args) => dispatch('trackPageView', args);
export const trackProjectOpen = (...args) => dispatch('trackProjectOpen', args);
