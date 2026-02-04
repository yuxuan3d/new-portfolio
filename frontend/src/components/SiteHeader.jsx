import React, { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaBars, FaInstagram, FaLinkedin, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../constants/social';
import { useTheme } from '../context/useTheme';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateX(24px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export default function SiteHeader() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();

  const menuButtonRef = useRef(null);
  const firstMenuLinkRef = useRef(null);

  const closeMenu = (restoreFocus = false) => {
    setIsMenuOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  };

  useEffect(() => {
    // Close on route change.
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    requestAnimationFrame(() => firstMenuLinkRef.current?.focus());
  }, [isMenuOpen]);

  return (
    <HeaderWrapper>
      <HeaderInner>
        <Logo to="/">yxperiments</Logo>

        <DesktopNav aria-label="Primary navigation">
          <NavItem to="/about">About</NavItem>
          <NavItem to="/contact">Contact</NavItem>
          <NavItem to="/rnd">Latest R&amp;D</NavItem>
          <IconButton
            onClick={toggleTheme}
            type="button"
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </IconButton>
          <SocialRow aria-label="Social links">
            <SocialIconLink
              href={SOCIAL_LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </SocialIconLink>
            <SocialIconLink
              href={SOCIAL_LINKS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </SocialIconLink>
          </SocialRow>
        </DesktopNav>

        <MobileControls aria-label="Mobile navigation controls">
          <IconButton
            onClick={toggleTheme}
            type="button"
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </IconButton>
          <IconButton
            ref={menuButtonRef}
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </IconButton>
        </MobileControls>
      </HeaderInner>

      {isMenuOpen && (
        <Backdrop onClick={() => closeMenu(true)} role="presentation">
          <Drawer
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onClick={(event) => event.stopPropagation()}
          >
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
              <DrawerClose
                type="button"
                aria-label="Close menu"
                onClick={() => closeMenu(true)}
              >
                <FaTimes size={22} />
              </DrawerClose>
            </DrawerHeader>

            <DrawerNav aria-label="Mobile navigation">
              <DrawerLink
                ref={firstMenuLinkRef}
                to="/"
                end
                onClick={() => closeMenu(true)}
              >
                Home
              </DrawerLink>
              <DrawerLink to="/about" onClick={() => closeMenu(true)}>
                About
              </DrawerLink>
              <DrawerLink to="/contact" onClick={() => closeMenu(true)}>
                Contact
              </DrawerLink>
              <DrawerLink to="/rnd" onClick={() => closeMenu(true)}>
                Latest R&amp;D
              </DrawerLink>
            </DrawerNav>

            <DrawerSection aria-label="Social links">
              <DrawerSectionTitle>Social</DrawerSectionTitle>
              <DrawerSocialRow>
                <DrawerSocialLink
                  href={SOCIAL_LINKS.LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => closeMenu(true)}
                >
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </DrawerSocialLink>
                <DrawerSocialLink
                  href={SOCIAL_LINKS.INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => closeMenu(true)}
                >
                  <FaInstagram />
                  <span>Instagram</span>
                </DrawerSocialLink>
              </DrawerSocialRow>
            </DrawerSection>
          </Drawer>
        </Backdrop>
      )}
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.surface};
  transition: background-color 0.3s ease;
  padding: 2rem 6vw;

  @media (max-width: 720px) {
    padding: 1.25rem 6vw;
  }
`;

const HeaderInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;

  @media (max-width: 720px) {
    font-size: 1.35rem;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 719px) {
    display: none;
  }
`;

const MobileControls = styled.div`
  display: none;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 719px) {
    display: flex;
  }
`;

const NavItem = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 600;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.text.secondary};
  }

  &[aria-current='page'] {
    color: ${({ theme }) => theme.accent};
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
`;

const SocialIconLink = styled.a`
  color: ${({ theme }) => theme.text.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text.secondary};
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  padding: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text.secondary};
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: flex-end;
  z-index: 999;
  animation: ${fadeIn} 160ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Drawer = styled.div`
  width: min(380px, 92vw);
  height: 100%;
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  border-left: 1px solid ${({ theme }) => theme.border};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${slideIn} 220ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DrawerTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text.primary};
`;

const DrawerClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 10px;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`;

const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DrawerLink = styled(NavLink)`
  padding: 0.85rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid transparent;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.card.background};
  }

  &[aria-current='page'] {
    border-color: ${({ theme }) => theme.accent};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`;

const DrawerSection = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const DrawerSectionTitle = styled.p`
  margin: 0 0 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.secondary};
`;

const DrawerSocialRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DrawerSocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card.background};
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }

  span {
    flex: 1;
  }
`;
