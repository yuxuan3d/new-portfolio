import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const isHome = location.pathname === '/';

  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const firstMenuLinkRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return undefined;

    let frame = 0;
    const setHeaderHeight = () => {
      if (!headerRef.current) return;
      const height = Math.round(headerRef.current.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--site-header-height', `${height}px`);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(setHeaderHeight);
    };

    schedule();

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(element);
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

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

    const focusables = drawerRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusable = focusables?.[0];
    const lastFocusable = focusables?.[focusables.length - 1];

    // Keep focus cycling inside the menu while it is open.
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== 'Tab' || !focusables?.length) return;

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    requestAnimationFrame(() => firstMenuLinkRef.current?.focus());
  }, [isMenuOpen]);

  const menuOverlay = isMenuOpen
    ? createPortal(
      <Backdrop onClick={() => closeMenu(true)} role="presentation">
        <Drawer
          id={menuId}
          ref={drawerRef}
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
      </Backdrop>,
      document.body,
    )
    : null;

  return (
    <>
      <HeaderWrapper ref={headerRef} $isHome={isHome}>
        <HeaderInner>
          <BrandCluster>
            <Logo to="/">yxperiments</Logo>
            <BrandTag>Motion + Interactive Lab</BrandTag>
          </BrandCluster>

          <DesktopNav aria-label="Primary navigation">
            <NavItem to="/" end>
              Home
            </NavItem>
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
      </HeaderWrapper>
      {menuOverlay}
    </>
  );
}

const HeaderWrapper = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 80;
  padding: 1rem 6vw 0.85rem;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: ${({ $isHome, theme }) =>
    $isHome
      ? `linear-gradient(180deg, ${theme.chrome || theme.surface} 0%, transparent 100%)`
      : `linear-gradient(180deg, ${theme.chrome || theme.surface} 0%, ${
        theme.chromeAlt || theme.surfaceAlt || theme.surface
      } 100%)`};
  transition: background 0.3s ease;

  @media (max-width: 720px) {
    padding: 0.88rem 6vw 0.78rem;
  }
`;

const HeaderInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  border-radius: 24px;
  padding: 0.45rem 0.55rem 0.45rem 0.6rem;
  background: ${({ theme }) => theme.chromeAlt || theme.surfaceAlt || theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 10px 28px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};
`;

const BrandCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
`;

const Logo = styled(Link)`
  font-family: 'Fraunces', 'Times New Roman', serif;
  width: fit-content;
  font-size: 1.22rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-transform: none;
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  padding: 0.48rem 0.8rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
  border: 1px solid ${({ theme }) => theme.border};
  line-height: 1;

  @media (max-width: 720px) {
    font-size: 0.95rem;
    padding: 0.42rem 0.7rem;
  }
`;

const BrandTag = styled.span`
  font-size: 0.74rem;
  font-weight: 650;
  letter-spacing: 0.05em;
  text-transform: none;
  color: ${({ theme }) => theme.text.secondary};
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;
  opacity: 0.92;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: ${({ theme }) => theme.border};
    opacity: 0.9;
  }

  @media (max-width: 980px) {
    display: none;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 0.45rem;
  align-items: center;

  @media (max-width: 719px) {
    display: none;
  }
`;

const MobileControls = styled.div`
  display: none;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 719px) {
    display: flex;
  }
`;

const NavItem = styled(NavLink)`
  position: relative;
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 700;
  border-radius: 12px;
  font-size: 0.92rem;
  padding: 0.66rem 0.82rem;
  border: 1px solid transparent;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
    border-color: ${({ theme }) => theme.border};
  }

  &::after {
    content: '';
    position: absolute;
    left: 0.75rem;
    right: 0.75rem;
    bottom: 0.35rem;
    height: 2px;
    border-radius: 999px;
    background: ${({ theme }) => theme.accent};
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.2s ease;
  }

  &[aria-current='page'] {
    color: ${({ theme }) => theme.button.text};
    background: ${({ theme }) => theme.button.background};
    border-color: transparent;

    &::after {
      transform: scaleX(1);
      background: ${({ theme }) => theme.button.text};
      opacity: 0.7;
    }
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-left: 0.35rem;
  padding-left: 0.7rem;
  border-left: 1px solid ${({ theme }) => theme.border};
`;

const SocialIconLink = styled.a`
  color: ${({ theme }) => theme.text.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}1f`};
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.button.background};
    color: ${({ theme }) => theme.button.text};
  }
`;

const IconButton = styled.button`
  background: ${({ theme }) => theme.surfaceStrong || theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  padding: 0.55rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.button.text};
    background: ${({ theme }) => theme.button.background};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.focus || `${theme.accent}66`};
    outline-offset: 3px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 78% 12%, rgba(64, 172, 187, 0.22), transparent 42%),
    rgba(4, 12, 22, 0.72);
  display: flex;
  justify-content: flex-end;
  z-index: 999;
  animation: ${fadeIn} 160ms ease-out;
  backdrop-filter: blur(6px);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Drawer = styled.div`
  width: min(420px, 96vw);
  height: 100%;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.surfaceStrong || theme.surface} 0%,
    ${({ theme }) => theme.surfaceMuted || theme.surfaceAlt || theme.surface} 100%
  );
  border-left: 1px solid ${({ theme }) => theme.border};
  padding: 1.3rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${slideIn} 220ms ease-out;
  box-shadow: -24px 0 48px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.3)'};

  @media (max-width: 540px) {
    width: 100vw;
    border-left: none;
  }

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
  background: ${({ theme }) => theme.surfaceStrong || theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
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
  padding: 0.9rem 1rem;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceStrong || theme.surface};
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
    transform: translateY(-1px);
  }

  &[aria-current='page'] {
    border-color: ${({ theme }) => theme.accent};
    background: ${({ theme }) => theme.button.background};
    color: ${({ theme }) => theme.button.text};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.focus || `${theme.accent}66`};
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
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceStrong || theme.surface};
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.focus || `${theme.accent}66`};
    outline-offset: 2px;
  }

  span {
    flex: 1;
  }
`;
