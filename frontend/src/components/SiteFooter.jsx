import React from 'react';
import styled from 'styled-components';
import { SOCIAL_LINKS } from '../constants/social';

export default function SiteFooter() {
  return (
    <FooterWrapper>
      <FooterInner>
        <FooterText>&copy; {new Date().getFullYear()} yxperiments. All rights reserved.</FooterText>
        <FooterLinks aria-label="Footer social links">
          <FooterLink href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </FooterLink>
          <FooterLink href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer">
            Instagram
          </FooterLink>
        </FooterLinks>
      </FooterInner>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.surface};
  transition: background-color 0.3s ease;
  padding: 2rem 6vw;

  @media (max-width: 720px) {
    padding: 1.75rem 6vw;
  }
`;

const FooterInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
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

const FooterLinks = styled.div`
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

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 3px;
    border-radius: 8px;
  }
`;
