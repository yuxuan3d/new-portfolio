import React from 'react';
import styled from 'styled-components';

export default function SiteFooter() {
  return (
    <Footer>
      <FooterBottom>
        <span>&copy; {new Date().getFullYear()} yxperiments.</span>
      </FooterBottom>
    </Footer>
  );
}

const Footer = styled.footer`
  width: 100%;
  padding: 0 var(--site-gutter) 2rem;
`;

const FooterBottom = styled.div`
  width: min(var(--site-max-width), calc(100vw - (var(--site-gutter) * 2)));
  margin: 0.9rem auto 0;
  padding: 0 0.2rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.74rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.02em;

  @media (max-width: 720px) {
    flex-direction: column;
    text-align: center;
  }
`;
