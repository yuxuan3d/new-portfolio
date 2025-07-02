import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes, ThemeProvider as StyledThemeProvider } from 'styled-components';
import { FaLinkedin, FaInstagram, FaSun, FaMoon } from 'react-icons/fa';
import { urlFor } from './lib/sanityClient';
import { useSanityData } from './hooks/useSanityData';
import ProjectDetail from './components/ProjectDetail';
import About from './components/About';
import Contact from './components/Contact';
import LazyImage from './components/LazyImage';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { lightTheme, darkTheme } from './styles/theme';
import { Analytics } from "@vercel/analytics/react"

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

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

function PortfolioGrid() {
  const [portfolioItems, error] = useSanityData(`
    *[_type == "portfolioItem"] | order(orderRank) {
      _id,
      title,
      slug,
      mainImage,
      projectLink
    }
  `);

  if (!portfolioItems) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <LoadingSpinner />
          <LoadingText>Loading Projects</LoadingText>
          <LoadingDots>
            <Dot />
            <Dot />
            <Dot />
          </LoadingDots>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <Grid>
      {portfolioItems?.map((item) => (
        <Link to={`/project/${item.slug.current}`} key={item._id} style={{ textDecoration: 'none' }}>
          <PortfolioTile>
            <LazyImage
              src={urlFor(item.mainImage)
                .auto('format')
                .width(800)
                .height(800)
                .fit('crop')
                .quality(90)
                .url()}
              alt={item.title}
            />
            <TileOverlay>
              <h3>{item.title}</h3>
            </TileOverlay>
          </PortfolioTile>
        </Link>
      ))}
    </Grid>
  );
}

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <ThemeButton onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
    </ThemeButton>
  );
}

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
          <HeaderWrapper>
            <HeaderContent>
              <Logo to="/">yxperiments</Logo>
              <Nav>
                <NavLink as={Link} to="/about">About</NavLink>
                <NavLink as={Link} to="/contact">Contact</NavLink>
                <ThemeToggle />
                <SocialLinks>
                  <SocialIconLink href="https://www.linkedin.com/in/yu-xuan-chong" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={20} />
                  </SocialIconLink>
                  <SocialIconLink href="https://www.instagram.com/yxperiments" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={20} />
                  </SocialIconLink>
                </SocialLinks>
              </Nav>
            </HeaderContent>
          </HeaderWrapper>

          <MainContent>
            <Routes>
              <Route path="/" element={<PortfolioGrid />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </MainContent>

          <FooterWrapper>
            <FooterContent>
              <FooterText>&copy; {new Date().getFullYear()} yxperiments. All rights reserved.</FooterText>
              <FooterSocialLinks>
                <FooterLink href="https://www.linkedin.com/in/yu-xuan-chong" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </FooterLink>
                <FooterLink href="https://www.instagram.com/yxperiments" target="_blank" rel="noopener noreferrer">
                  Instagram
                </FooterLink>
              </FooterSocialLinks>
            </FooterContent>
          </FooterWrapper>
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

const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.surface};
  transition: background-color 0.3s ease;
`;

const HeaderContent = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 6vw;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 6vw;
  }
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  margin: 0 auto;
  padding: 0 6vw;
`;

const FooterWrapper = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.surface};
  transition: background-color 0.3s ease;
`;

const FooterContent = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 2rem 6vw;
  text-align: center;
  color: ${({ theme }) => theme.text.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FooterText = styled.p`
  margin: 0;
`;

const FooterSocialLinks = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.text.secondary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  transition: color 0.3s ease;

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
  padding: 2rem 0;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PortfolioTile = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
  background: ${({ theme }) => theme.card.background};

  &:hover {
    transform: scale(1.02);
  }

  img {
    transition: filter 0.3s ease;
  }

  &:hover img {
    filter: brightness(0.2);
  }
`;

const TileOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.2);
  
  h3 {
    color: white;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
    transform: translateY(20px);
    transition: transform 0.3s ease;
  }

  ${PortfolioTile}:hover & {
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
    
    h3 {
      transform: translateY(0);
    }
  }
`;

const LoadingContainer = styled.div`
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.surface};
  border-radius: 12px;
  margin: 2rem 0;
  transition: background-color 0.3s ease;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${({ theme }) => theme.spinner.border};
  border-top: 3px solid ${({ theme }) => theme.spinner.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
  animation: ${fadeInOut} 2s ease-in-out infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #e74c3c;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 600px) {
    gap: 1.5rem;
  }
`;

const SocialIconLink = styled.a`
  color: ${({ theme }) => theme.text.primary};
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const ThemeButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text.secondary};
    transform: scale(1.1);
  }
`;

export default App;