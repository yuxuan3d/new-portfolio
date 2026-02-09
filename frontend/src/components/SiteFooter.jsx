import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { EXTERNAL_LINKS, SOCIAL_LINKS } from '../constants/social';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Latest R&D', to: '/rnd' },
];

const SOCIAL_ITEMS = [
  { label: 'LinkedIn', href: SOCIAL_LINKS.LINKEDIN },
  { label: 'Instagram', href: SOCIAL_LINKS.INSTAGRAM },
];

export default function SiteFooter() {
  return (
    <FooterWrapper>
      <FooterGrid>
        <BrandPanel>
          <BrandName>yxperiments</BrandName>
          <BrandText>
            3D, motion, and interactive experiments by Yu Xuan.
          </BrandText>
          <MetaRow aria-label="Availability highlights">
            <MetaChip>Available for collaborations</MetaChip>
            <MetaChip>Open to long-form projects</MetaChip>
          </MetaRow>
          <ResumeLink
            href={EXTERNAL_LINKS.RESUME}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume
          </ResumeLink>
        </BrandPanel>

        <LinkColumn aria-label="Footer navigation">
          <ColumnTitle>Navigate</ColumnTitle>
          <LinkList>
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <FooterNavLink to={item.to}>{item.label}</FooterNavLink>
              </li>
            ))}
          </LinkList>
        </LinkColumn>

        <LinkColumn aria-label="Footer social links">
          <ColumnTitle>Connect</ColumnTitle>
          <LinkList>
            {SOCIAL_ITEMS.map((item) => (
              <li key={item.href}>
                <FooterExternalLink
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </FooterExternalLink>
              </li>
            ))}
          </LinkList>
        </LinkColumn>
      </FooterGrid>

      <FooterBottom>
        <span>&copy; {new Date().getFullYear()} yxperiments.</span>
        <span>Built with React and Sanity.</span>
      </FooterBottom>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  width: 100%;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.surfaceAlt || theme.surface} 0%,
    ${({ theme }) => theme.surfaceStrong || theme.surface} 100%
  );
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 2.5rem 6vw 1.6rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(26rem 18rem at 92% -8%, ${({ theme }) => theme.accentSoft || `${theme.accent}1f`}, transparent 72%),
      linear-gradient(90deg, transparent calc(50% - 0.5px), ${({ theme }) => theme.border} calc(50% - 0.5px), ${({ theme }) => theme.border} calc(50% + 0.5px), transparent calc(50% + 0.5px));
    opacity: 0.42;
  }

  @media (max-width: 720px) {
    padding: 2rem 6vw 1.5rem;
  }
`;

const FooterGrid = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 0.75fr 0.75fr;
  gap: 1.2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }
`;

const BrandPanel = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 1.15rem 1.1rem;
  background: ${({ theme }) => theme.surfaceStrong || theme.surface};
  box-shadow: 0 10px 28px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.16)'};
  display: grid;
  gap: 0.65rem;
`;

const BrandName = styled.p`
  font-family: 'Fraunces', 'Times New Roman', serif;
  margin: 0;
  font-size: 1.18rem;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.text.primary};
`;

const BrandText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.55;
  max-width: 46ch;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.28rem 0.64rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1.1;
`;

const ResumeLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  text-decoration: none;
  font-weight: 700;
  color: ${({ theme }) => theme.button.text};
  background: ${({ theme }) => theme.button.background};
  border-radius: 999px;
  padding: 0.55rem 0.95rem;
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 20px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.18)'};
  line-height: 1.1;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.button.hover};
  }
`;

const LinkColumn = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 1.1rem;
  background: ${({ theme }) => theme.surfaceStrong || theme.surface};
`;

const ColumnTitle = styled.h2`
  margin: 0 0 0.7rem;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text.secondary};
`;

const LinkList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem;
`;

const sharedLinkStyles = css`
  display: inline-flex;
  width: fit-content;
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 700;
  border-radius: 10px;
  padding: 0.35rem 0.5rem;
  transition: transform 0.2s ease, color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.accent};
    background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
    transform: translateX(2px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.focus || `${theme.accent}66`};
    outline-offset: 3px;
  }
`;

const FooterNavLink = styled(Link)`
  ${sharedLinkStyles}
`;

const FooterExternalLink = styled.a`
  ${sharedLinkStyles}
`;

const FooterBottom = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 1rem auto 0;
  padding-top: 0.95rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.86rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;

  @media (max-width: 720px) {
    flex-direction: column;
    text-align: center;
  }
`;
