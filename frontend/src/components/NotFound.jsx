import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

export default function NotFound() {
  useDocumentMetadata({
    title: 'Page not found | yxperiments',
    description: 'The requested page could not be found.',
    canonical: null,
    noIndex: true,
  });

  return (
    <Page>
      <Panel>
        <Eyebrow>404</Eyebrow>
        <Title>Page not found</Title>
        <Copy>The page you requested does not exist or may have moved.</Copy>
        <HomeLink to="/#works">Return to Works</HomeLink>
      </Panel>
    </Page>
  );
}

const Page = styled.section`
  min-height: 60vh;
  width: min(var(--site-max-width), calc(100% - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: calc(var(--site-header-height, 96px) + 3rem) 0 4rem;
  display: grid;
  place-items: center;
`;

const Panel = styled.div`
  width: min(100%, 42rem);
  display: grid;
  gap: 1rem;
  padding: clamp(1.5rem, 5vw, 3rem);
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.accent};
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text.primary};
  font-size: clamp(2rem, 6vw, 4rem);
`;

const Copy = styled.p`
  color: ${({ theme }) => theme.text.secondary};
`;

const HomeLink = styled(Link)`
  width: fit-content;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0.7rem 1rem;
  color: ${({ theme }) => theme.button.text};
  background: ${({ theme }) => theme.button.background};
  font-family: 'Roboto Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
`;
