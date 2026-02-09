import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider as StyledThemeProvider } from 'styled-components';
import Home from './pages/Home';
import ProjectDetail from './components/ProjectDetail';
import About from './components/About';
import Contact from './components/Contact';
import RnDBlog from './components/RnDBlog';
import BlogPost from './components/BlogPost';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { useTheme } from './context/useTheme';
import { lightTheme, darkTheme } from './styles/theme';
import { Analytics } from '@vercel/analytics/react';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
    color-scheme: ${({ theme }) => theme.mode || 'dark'};
  }

  :root {
    --bg-base: ${({ theme }) => theme.background};
    --bg-accent-a: ${({ theme }) => theme.backgroundAccentA};
    --bg-accent-b: ${({ theme }) => theme.backgroundAccentB};
    --surface: ${({ theme }) => theme.surface};
    --surface-alt: ${({ theme }) => theme.surfaceAlt || theme.surface};
    --text-primary: ${({ theme }) => theme.text.primary};
    --text-secondary: ${({ theme }) => theme.text.secondary};
    --accent: ${({ theme }) => theme.accent};
    --accent-soft: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
    --border: ${({ theme }) => theme.border};
    --focus-ring: ${({ theme }) => theme.focus || `${theme.accent}66`};
  }

  body {
    font-family: 'Red Hat Display', 'Segoe UI', sans-serif;
    line-height: 1.55;
    color: var(--text-primary);
    background:
      radial-gradient(58rem 38rem at 10% -10%, var(--bg-accent-a), transparent 70%),
      radial-gradient(54rem 34rem at 88% 0%, var(--bg-accent-b), transparent 66%),
      radial-gradient(40rem 28rem at 50% 110%, var(--accent-soft), transparent 76%),
      linear-gradient(180deg, var(--bg-base) 0%, var(--bg-base) 100%);
    background-attachment: fixed;
    transition: color 0.35s ease, background 0.35s ease;
    position: relative;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    background:
      linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.08) 45%, transparent 100%),
      repeating-linear-gradient(
        45deg,
        transparent 0px,
        transparent 12px,
        rgba(255, 255, 255, 0.03) 12px,
        rgba(255, 255, 255, 0.03) 13px
      );
    opacity: 0.5;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: -1;
    background:
      linear-gradient(
        90deg,
        transparent calc(50% - 0.5px),
        rgba(255, 255, 255, 0.16) calc(50% - 0.5px),
        rgba(255, 255, 255, 0.16) calc(50% + 0.5px),
        transparent calc(50% + 0.5px)
      );
    opacity: 0.18;
  }

  h1, h2, h3, h4 {
    font-family: 'Fraunces', 'Times New Roman', serif;
    letter-spacing: -0.02em;
    font-variation-settings: 'SOFT' 40;
    text-wrap: balance;
  }

  a {
    color: inherit;
  }

  a, button, input, textarea {
    font-family: inherit;
  }

  :focus-visible {
    outline: 3px solid var(--focus-ring);
    outline-offset: 2px;
  }

  ::selection {
    color: ${({ theme }) => theme.button.text};
    background: ${({ theme }) => theme.accent};
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  @keyframes page-rise {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  main > * {
    animation: page-rise 0.48s ease both;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

function App() {
  return (
    <>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
      <Analytics />
    </>
  );
}

function ThemedApp() {
  const { isDarkMode } = useTheme();
  const theme = {
    ...(isDarkMode ? darkTheme : lightTheme),
    mode: isDarkMode ? 'dark' : 'light',
  };

  return (
    <StyledThemeProvider theme={theme}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <GlobalStyle />
        <PageWrapper>
          <SiteHeader />

          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rnd" element={<RnDBlog />} />
              <Route path="/rnd/:slug" element={<BlogPost />} />
            </Routes>
          </MainContent>

          <SiteFooter />
        </PageWrapper>
      </Router>
    </StyledThemeProvider>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding: 0 6vw 2.2rem;
`;

export default App;
