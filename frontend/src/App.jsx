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
  }

  body {
    font-family: 'Quicksand', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text.primary};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
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
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <StyledThemeProvider theme={theme}>
      <Router>
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
  padding: 0 6vw;
`;

export default App;
