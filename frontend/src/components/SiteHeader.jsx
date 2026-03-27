import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { FaBars, FaInstagram, FaLinkedin, FaTimes } from 'react-icons/fa';
import { HOME_NAV_ITEMS } from '../content/siteContent';
import { EXTERNAL_LINKS, SOCIAL_LINKS } from '../constants/social';

const overlayFade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const drawerSlide = keyframes`
  from {
    transform: translateX(18px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export default function SiteHeader() {
  const location = useLocation();
  const menuId = useId();
  const headerRef = useRef(null);
  const triggerRef = useRef(null);
  const firstLinkRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleSectionId, setVisibleSectionId] = useState('home');
  const sectionIds = useMemo(
    () => HOME_NAV_ITEMS.filter((item) => item.kind === 'section').map((item) => item.id),
    [],
  );

  useEffect(() => {
    if (location.pathname !== '/') {
      setVisibleSectionId('');
      return;
    }

    const nextId = decodeURIComponent(location.hash.replace('#', '')) || 'home';
    setVisibleSectionId(nextId);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return undefined;

    let frame = 0;
    const updateHeight = () => {
      if (!headerRef.current) return;
      const height = Math.round(headerRef.current.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--site-header-height', `${height}px`);
    };

    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateHeight);
    };

    schedule();

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(element);
    window.addEventListener('resize', schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== '/') return undefined;

    let frame = 0;

    const updateActiveSection = () => {
      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      const probe = window.scrollY + headerHeight + Math.max(window.innerHeight * 0.18, 120);
      const viewportBottom = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      let nextSectionId = 'home';

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;

        if (element.offsetTop <= probe) {
          nextSectionId = id;
        }
      });

      if (viewportBottom >= pageHeight - 24) {
        nextSectionId = sectionIds[sectionIds.length - 1];
      }

      setVisibleSectionId((current) => (current === nextSectionId ? current : nextSectionId));
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [location.pathname, sectionIds]);

  const activeSectionId = useMemo(() => {
    if (location.pathname === '/') {
      return visibleSectionId || 'home';
    }

    if (location.pathname === '/contact') {
      return 'contact';
    }

    if (location.pathname.startsWith('/rnd')) {
      return 'blog';
    }

    return '';
  }, [location.pathname, visibleSectionId]);

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
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    window.requestAnimationFrame(() => firstLinkRef.current?.focus());
  }, [isMenuOpen]);

  const drawer = isMenuOpen
    ? createPortal(
      <DrawerBackdrop onClick={() => setIsMenuOpen(false)} role="presentation">
        <Drawer
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Primary navigation"
          onClick={(event) => event.stopPropagation()}
        >
          <DrawerHeader>
            <DrawerBrand to="/">yxperiments</DrawerBrand>
            <DrawerClose type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
              <FaTimes size={16} />
            </DrawerClose>
          </DrawerHeader>

          <DrawerIntro>
            Motion, VFX, and interactive portfolio work with a running R&amp;D journal.
          </DrawerIntro>

          <DrawerNav aria-label="Section navigation">
            {HOME_NAV_ITEMS.map((item, index) => (
              <DrawerLink
                key={item.id}
                ref={index === 0 ? firstLinkRef : null}
                to={item.to}
                $active={activeSectionId === item.id}
              >
                <span>{item.label}</span>
                <DrawerSuffix>/</DrawerSuffix>
              </DrawerLink>
            ))}
          </DrawerNav>

          <DrawerMeta>
            <DrawerCta href={EXTERNAL_LINKS.RESUME} target="_blank" rel="noopener noreferrer">
              Download CV
            </DrawerCta>
            <DrawerSocials>
              <DrawerSocialLink href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={14} />
                <span>LinkedIn</span>
              </DrawerSocialLink>
              <DrawerSocialLink href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={14} />
                <span>Instagram</span>
              </DrawerSocialLink>
            </DrawerSocials>
          </DrawerMeta>
        </Drawer>
      </DrawerBackdrop>,
      document.body,
    )
    : null;

  return (
    <>
      <Header ref={headerRef}>
        <HeaderInner>
          <BrandCluster>
            <BrandBlock>
              <Brand to="/">yxperiments</Brand>
              <BrandMeta href={EXTERNAL_LINKS.RESUME} target="_blank" rel="noopener noreferrer">
                Download CV
              </BrandMeta>
            </BrandBlock>
          </BrandCluster>

          <HeaderActions>
            <DesktopNav aria-label="Section navigation">
              {HOME_NAV_ITEMS.map((item) => (
                <DesktopNavLink
                  key={item.id}
                  to={item.to}
                  $active={activeSectionId === item.id}
                >
                  {item.label}
                </DesktopNavLink>
              ))}
            </DesktopNav>
            <MenuButton
              ref={triggerRef}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              {isMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </MenuButton>
          </HeaderActions>
        </HeaderInner>
      </Header>
      {drawer}
    </>
  );
}

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  padding: 0 var(--site-gutter);
  background: ${({ theme }) => theme.chromeStrong};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  pointer-events: none;
`;

const HeaderInner = styled.div`
  width: calc(100vw - (var(--site-gutter) * 2));
  margin: 0 auto;
  min-height: 122px;
  padding-top: clamp(2rem, 2.65vw, 2.75rem);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  pointer-events: none;

  @media (max-width: 840px) {
    min-height: 92px;
    padding-top: 1.6rem;
  }
`;

const BrandCluster = styled.div`
  min-width: 0;
  display: grid;
  pointer-events: auto;
`;

const BrandBlock = styled.div`
  display: grid;
  gap: 0.35rem;
`;

const Brand = styled(Link)`
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.text.primary};
`;

const BrandMeta = styled.a`
  width: fit-content;
  text-decoration: none;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.72rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const controlStyles = css`
  min-height: 40px;
  padding: 0.65rem 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(16, 16, 16, 0.84);
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 500;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  pointer-events: auto;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  pointer-events: auto;
`;

const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: clamp(1.4rem, 2vw, 2.6rem);

  @media (min-width: 1080px) {
    display: flex;
  }
`;

const DesktopNavLink = styled(Link)`
  position: relative;
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.45rem;
    height: 1px;
    background: ${({ theme }) => theme.accent};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: left center;
    transition: transform 0.2s ease;
    opacity: 0.9;
  }

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const MenuButton = styled.button`
  ${controlStyles}
  width: 46px;
  padding: 0;
  cursor: pointer;

  @media (min-width: 1080px) {
    display: none;
  }
`;

const DrawerBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.74);
  backdrop-filter: blur(8px);
  display: grid;
  align-items: start;
  padding: 1.25rem;
  z-index: 200;
  animation: ${overlayFade} 180ms ease;
`;

const Drawer = styled.div`
  width: min(100%, 420px);
  margin-left: auto;
  padding: 1.15rem;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: ${({ theme }) => theme.surfaceStrong};
  display: grid;
  gap: 1rem;
  animation: ${drawerSlide} 180ms ease;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DrawerBrand = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const DrawerClose = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const DrawerIntro = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  max-width: 32ch;
`;

const DrawerNav = styled.nav`
  display: grid;
  gap: 0.55rem;
`;

const DrawerLink = styled(Link)`
  min-height: 52px;
  padding: 0.9rem 1rem;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.borderStrong : theme.border)};
  background: ${({ theme, $active }) => ($active ? theme.accentSurface : 'rgba(255, 255, 255, 0.02)')};
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const DrawerSuffix = styled.span`
  color: ${({ theme }) => theme.text.muted};
`;

const DrawerMeta = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
  padding-top: 1rem;
  display: grid;
  gap: 0.75rem;
`;

const DrawerCta = styled.a`
  ${controlStyles}
  width: fit-content;
`;

const DrawerSocials = styled.div`
  display: grid;
  gap: 0.55rem;
`;

const DrawerSocialLink = styled.a`
  min-height: 48px;
  padding: 0.85rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  span {
    font-size: 0.86rem;
  }
`;
