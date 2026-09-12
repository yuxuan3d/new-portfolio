import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import styled, { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components';
import LazyRouteBoundary from './components/LazyRouteBoundary';
import LoadingState from './components/LoadingState';
import NotFound from './components/NotFound';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import { initAnalytics, trackPageView } from './lib/siteEvents';
import { getSafeSectionHash } from './lib/navigation';
import Home from './pages/Home';
import { BREAKPOINTS } from './styles/breakpoints';
import { siteTheme } from './styles/theme';

const OptionalAnalytics = React.lazy(() => import('@vercel/analytics/react')
  .then(({ Analytics }) => ({ default: Analytics }))
  .catch(() => ({ default: () => null })));

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    color-scheme: dark;
    --site-max-width: 1312px;
    --site-header-height: 64px;
    --site-gutter: 64px;
    --section-gap: clamp(3rem, 5vw, 4.5rem);
    --panel-padding: 24px;
    --bg-base: ${({ theme }) => theme.background};
    --bg-accent-a: ${({ theme }) => theme.backgroundAccentA};
    --bg-accent-b: ${({ theme }) => theme.backgroundAccentB};
    --bg-accent-c: ${({ theme }) => theme.backgroundAccentC};
    --surface: ${({ theme }) => theme.surface};
    --surface-alt: ${({ theme }) => theme.surfaceAlt};
    --text-primary: ${({ theme }) => theme.text.primary};
    --text-secondary: ${({ theme }) => theme.text.secondary};
    --text-muted: ${({ theme }) => theme.text.muted};
    --accent: ${({ theme }) => theme.accent};
    --accent-alt: ${({ theme }) => theme.accentAlt};
    --accent-soft: ${({ theme }) => theme.accentSoft};
    --border: ${({ theme }) => theme.border};
    --border-strong: ${({ theme }) => theme.borderStrong};
    --focus-ring: ${({ theme }) => theme.focus};
  }

  html {
    min-width: 320px;
    min-height: 100%;
    scroll-behavior: smooth;
    background: var(--bg-base);
  }

  body {
    position: relative;
    min-height: 100vh;
    background: var(--bg-base);
    color: var(--text-primary);
    font-family: 'Poppins', 'Segoe UI', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
  }

  a,
  button,
  input,
  textarea {
    font: inherit;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: 'Poppins', 'Segoe UI', sans-serif;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  section[id] {
    scroll-margin-top: calc(var(--site-header-height, 84px) + 1.25rem);
  }

  #root {
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  :focus-visible {
    outline: 3px solid var(--focus-ring);
    outline-offset: 3px;
  }

  ::selection {
    color: ${({ theme }) => theme.button.text};
    background: ${({ theme }) => theme.accent};
  }

  @media(max-width: 359px) { :root { --site-gutter: 16px; } }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
  }

  @media (max-width: ${BREAKPOINTS.tablet}px) {
    :root {
      --site-header-height: 64px;
      --site-gutter: 24px;
      --section-gap: 56px;
      --panel-padding: 24px;
    }

    body::before {
      opacity: 0.09;
    }
  }

  @media (max-width: 767px) {
    :root { --site-header-height: 56px; }
    :root {
      --site-gutter: 20px;
      --section-gap: 40px;
      --panel-padding: 20px;
    }

    body::before {
      opacity: 0.05;
    }

    body::before,
    body::after {
      display: none;
    }
  }
`;

const ProjectDetail = React.lazy(() => import('./components/ProjectDetail'));
const Contact = React.lazy(() => import('./components/Contact'));
const RnDBlog = React.lazy(() => import('./components/RnDBlog'));
const BlogPost = React.lazy(() => import('./components/BlogPost'));

function getHeaderOffset() {
  const measuredHeight = document.querySelector('header')?.getBoundingClientRect().height;
  return measuredHeight || Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')) || 0;
}

function targetScrollPosition(element) {
  return Math.max(0, element.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 20);
}

function scrollToTarget(element, behavior) {
  const top = targetScrollPosition(element);
  const isAligned = Math.abs(window.scrollY - top) <= 1;
  if (isAligned && behavior !== 'smooth') return false;

  if (behavior === 'auto') {
    // Explicit instant positioning also respects reduced-motion navigation.
    window.scrollTo({ top, left: 0, behavior: 'instant' });
  } else {
    window.scrollTo({ top, left: 0, behavior: 'smooth' });
  }
  return true;
}

function ScrollManager({ location, homeLayoutReady }) {
  const navigationType = useNavigationType();
  React.useEffect(() => {
    if (location.pathname === '/' && location.hash && !homeLayoutReady) {
      return undefined;
    }

    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return undefined;
    }

    const id = getSafeSectionHash(location.hash);
    if (!id) return undefined;

    let frameOne = 0;
    let frameTwo = 0;
    let settleTimer = 0;
    let scrollEndTimer = 0;
    let correctionApplied = false;
    let layoutChanged = false;
    let previousDocumentTop;
    let stableChecks = 0;
    let monitorStartedAt = 0;
    let layoutObserver;

    const alignAfterUserScroll = () => {
      if (correctionApplied) return;
      correctionApplied = true;
      const element = document.getElementById(id);
      if (element) scrollToTarget(element, 'auto');
    };

    const monitorAutoAlignment = () => {
      const element = document.getElementById(id);
      if (!element) return;

      const documentTop = element.getBoundingClientRect().top + window.scrollY;
      const moved = Math.abs((previousDocumentTop ?? documentTop) - documentTop) > 0.5;
      if (moved || layoutChanged) {
        scrollToTarget(element, 'auto');
        stableChecks = 0;
        layoutChanged = false;
      } else {
        stableChecks += 1;
      }
      previousDocumentTop = documentTop;

      const elapsed = performance.now() - monitorStartedAt;
      if (elapsed >= 1600 || (elapsed >= 900 && stableChecks >= 3)) return;
      settleTimer = window.setTimeout(monitorAutoAlignment, 100);
    };

    frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (!element) return;

        if (navigationType === 'PUSH') {
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          scrollToTarget(element, reducedMotion ? 'auto' : 'smooth');
          window.addEventListener('scrollend', alignAfterUserScroll, { once: true });
          // Long pages can exceed 800ms of native smooth scrolling. Let scrollend
          // settle it before the fallback, avoiding a queued final-frame offset.
          scrollEndTimer = window.setTimeout(alignAfterUserScroll, 1800);
          return;
        }

        scrollToTarget(element, 'auto');
        previousDocumentTop = element.getBoundingClientRect().top + window.scrollY;
        monitorStartedAt = performance.now();
        if (typeof ResizeObserver !== 'undefined') {
          layoutObserver = new ResizeObserver(() => {
            layoutChanged = true;
          });
          layoutObserver.observe(document.body);
        }
        monitorAutoAlignment();
      });
    });

    return () => {
      window.cancelAnimationFrame(frameOne);
      window.cancelAnimationFrame(frameTwo);
      window.clearTimeout(settleTimer);
      window.clearTimeout(scrollEndTimer);
      window.removeEventListener('scrollend', alignAfterUserScroll);
      layoutObserver?.disconnect();
    };
  }, [homeLayoutReady, location.hash, location.pathname, navigationType]);

  return null;
}

function LazyRoute({ children }) {
  return (
    <LazyRouteBoundary>
      <Suspense fallback={<LoadingState label="Loading page" minHeight="360px" margin="0" />}>
        {children}
      </Suspense>
    </LazyRouteBoundary>
  );
}

function AppRoutes({ location, onHomeLayoutReady, overlayOpen }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<Home onLayoutReady={onHomeLayoutReady} overlayOpen={overlayOpen} />} />
      <Route path="/about" element={<Navigate replace to="/#resume" />} />
      <Route path="/project/:slug" element={<LazyRoute><ProjectDetail /></LazyRoute>} />
      <Route path="/contact" element={<LazyRoute><Contact /></LazyRoute>} />
      <Route path="/rnd" element={<LazyRoute><RnDBlog /></LazyRoute>} />
      <Route path="/rnd/:slug" element={<LazyRoute><BlogPost /></LazyRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppFrame() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const routeLocation = backgroundLocation || location;
  const [readyHomeLocationKey, setReadyHomeLocationKey] = React.useState(null);
  const homeLayoutReady = routeLocation.pathname !== '/' || readyHomeLocationKey === routeLocation.key;

  React.useEffect(() => {
    trackPageView();
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <GlobalStyle />
      <ScrollManager location={routeLocation} homeLayoutReady={homeLayoutReady} />
      <PageShell data-site-shell>
        <SiteHeader />
        <MainContent>
          <AppRoutes
            location={routeLocation}
            overlayOpen={Boolean(backgroundLocation)}
            onHomeLayoutReady={() => setReadyHomeLocationKey(routeLocation.key)}
          />
        </MainContent>
        <SiteFooter />
      </PageShell>

      {backgroundLocation ? (
        <Routes>
          <Route path="/project/:slug" element={<LazyRoute><ProjectDetail overlay /></LazyRoute>} />
        </Routes>
      ) : null}
    </>
  );
}

function App() {
  React.useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <>
      <StyledThemeProvider theme={siteTheme}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppFrame />
        </Router>
      </StyledThemeProvider>
      <Suspense fallback={null}><OptionalAnalytics /></Suspense>
    </>
  );
}

const PageShell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

export default App;
