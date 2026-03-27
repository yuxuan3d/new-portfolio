export const BREAKPOINTS = {
  phone: 640,
  tablet: 1023,
  desktop: 1024,
  wide: 1180,
};

export const MEDIA = {
  phone: `@media (max-width: ${BREAKPOINTS.phone}px)`,
  tabletDown: `@media (max-width: ${BREAKPOINTS.tablet}px)`,
  tabletOnly: `@media (min-width: ${BREAKPOINTS.phone + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`,
  desktopUp: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
  wideUp: `@media (min-width: ${BREAKPOINTS.wide}px)`,
};
