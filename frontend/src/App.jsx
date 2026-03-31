import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styled, { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components';
import BlogPost from './components/BlogPost';
import Contact from './components/Contact';
import ProjectDetail from './components/ProjectDetail';
import RnDBlog from './components/RnDBlog';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import Home from './pages/Home';
import { BREAKPOINTS } from './styles/breakpoints';
import { siteTheme } from './styles/theme';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    color-scheme: dark;
    --site-max-width: 1240px;
    --site-header-height: 102px;
    --site-gutter: clamp(1.5rem, 2vw, 2.25rem);
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
    background:
      radial-gradient(56rem 28rem at 50% -10%, var(--bg-accent-a), transparent 60%),
      radial-gradient(34rem 24rem at 84% 10%, var(--bg-accent-b), transparent 60%),
      linear-gradient(180deg, #101010 0%, #0f0f0f 100%);
    color: var(--text-primary);
    font-family: 'Poppins', 'Segoe UI', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 1) 0.85px, transparent 1.05px);
    background-size: 28px 28px;
    background-position: center top;
    opacity: 0.15;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 18%, transparent 78%, rgba(0, 0, 0, 0.32));
    opacity: 0.32;
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
      --site-header-height: 76px;
      --site-gutter: 24px;
      --section-gap: 56px;
      --panel-padding: 24px;
    }

    body::before {
      opacity: 0.09;
    }
  }

  @media (max-width: ${BREAKPOINTS.phone}px) {
    :root {
      --site-gutter: 16px;
      --section-gap: 40px;
      --panel-padding: 20px;
    }

    body::before {
      opacity: 0.05;
    }
  }
`;

function ScrollManager({ location }) {
  React.useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      return undefined;
    }

    const id = decodeURIComponent(location.hash.slice(1));
    const timeout = window.setTimeout(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--site-header-height'),
      ) || 0;
      const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 60);

    return () => window.clearTimeout(timeout);
  }, [location.pathname, location.hash]);

  return null;
}

function AppRoutes({ location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<Navigate replace to="/#resume" />} />
      <Route path="/project/:slug" element={<ProjectDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rnd" element={<RnDBlog />} />
      <Route path="/rnd/:slug" element={<BlogPost />} />
    </Routes>
  );
}

function AppFrame() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const routeLocation = backgroundLocation || location;

  return (
    <>
      <GlobalStyle />
      <ScrollManager location={routeLocation} />
      <PageShell>
        <SiteHeader />
        <MainContent>
          <AppRoutes location={routeLocation} />
        </MainContent>
        <SiteFooter />
      </PageShell>

      {backgroundLocation ? (
        <Routes>
          <Route path="/project/:slug" element={<ProjectDetail overlay />} />
        </Routes>
      ) : null}
    </>
  );
}

function App() {
  return (
    <>
      <StyledThemeProvider theme={siteTheme}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppFrame />
        </Router>
      </StyledThemeProvider>
      <Analytics />
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
