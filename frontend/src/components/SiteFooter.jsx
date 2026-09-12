import React from 'react';
import styled from 'styled-components';
import { SOCIAL_LINKS } from '../constants/social';

export default function SiteFooter() {
  return (
    <Footer>
      <FooterBottom>
        <span>&copy; {new Date().getFullYear()} yxperiments.</span>
        <nav aria-label="Social links">
          <a href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        </nav>
      </FooterBottom>
    </Footer>
  );
}

const Footer = styled.footer`
  width: 100%;
  padding: 0.75rem var(--site-gutter) 2rem;
  background: var(--bg-base);
`;

const FooterBottom = styled.div`
  width: min(var(--site-max-width), calc(100vw - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: 0 0.2rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.74rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.02em;
  align-items: center;
  nav { display: flex; gap: 24px; }
  a { display: inline-flex; align-items: center; min-height: 44px; color: var(--text-secondary); font-size: 14px; text-decoration: none; }

  @media (max-width: 720px) {
    flex-direction: column;
    text-align: center;
  }
`;
