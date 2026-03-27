import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { WORKS_CONTENT } from '../../content/siteContent';
import { urlFor } from '../../lib/sanityClient';
import LoadingState from '../LoadingState';
import LazyImage from '../LazyImage';

function getTopTags(projects, limit = 8) {
  const counts = new Map();

  projects.forEach((project) => {
    if (!Array.isArray(project.tags)) return;
    project.tags.forEach((tag) => {
      if (!tag) return;
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

export default function WorksSection({ projects, error, isLoading }) {
  const [activeTag, setActiveTag] = useState('All');

  const featuredCandidates = useMemo(
    () => projects.filter((project) => Boolean(project.featured)),
    [projects],
  );
  const featuredItems = useMemo(
    () => (featuredCandidates.length > 0 ? featuredCandidates : projects).slice(0, 3),
    [featuredCandidates, projects],
  );
  const featuredIds = useMemo(() => new Set(featuredItems.map((project) => project._id)), [featuredItems]);
  const archiveItems = useMemo(
    () => projects.filter((project) => !featuredIds.has(project._id)),
    [featuredIds, projects],
  );
  const orderedItems = useMemo(() => [...featuredItems, ...archiveItems], [featuredItems, archiveItems]);
  const tags = useMemo(() => getTopTags(orderedItems), [orderedItems]);
  const filteredItems = useMemo(() => {
    if (activeTag === 'All') return orderedItems;
    return orderedItems.filter((project) => Array.isArray(project.tags) && project.tags.includes(activeTag));
  }, [activeTag, orderedItems]);

  return (
    <Section id="works">
      <SectionHeader>
        <Title>{WORKS_CONTENT.title}</Title>
      </SectionHeader>

      {error ? <ErrorCard>{error}</ErrorCard> : null}

      <SectionBlock>
        {!isLoading && orderedItems.length > 0 ? (
          <FilterRail>
            <FilterButton type="button" $active={activeTag === 'All'} onClick={() => setActiveTag('All')}>
              All
            </FilterButton>
            {tags.map((tag) => (
              <FilterButton key={tag} type="button" $active={activeTag === tag} onClick={() => setActiveTag(tag)}>
                {tag}
              </FilterButton>
            ))}
          </FilterRail>
        ) : null}

        {isLoading ? (
          <LoadingState label="Loading Projects" minHeight="340px" margin="0" />
        ) : filteredItems.length > 0 ? (
          <ArchiveGrid aria-label="Projects">
            {filteredItems.map((project) => (
              <ArchiveLink to={`/project/${project.slug}`} key={project._id}>
                <ArchiveCard>
                  <ArchiveImage>
                    <LazyImage
                      src={urlFor(project.mainImage).auto('format').width(900).height(720).fit('crop').quality(90).url()}
                      alt={project.title}
                      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </ArchiveImage>
                  <ArchiveOverlay>
                    <ArchiveTitle>{project.title}</ArchiveTitle>
                  </ArchiveOverlay>
                </ArchiveCard>
              </ArchiveLink>
            ))}
          </ArchiveGrid>
        ) : (
          <EmptyState>
            {activeTag === 'All' ? 'No projects found.' : `No projects found for ${activeTag}.`}
          </EmptyState>
        )}
      </SectionBlock>
    </Section>
  );
}

const panelStyles = css`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0;
  background: ${({ theme }) => theme.surface};
`;

const Section = styled.section`
  width: min(var(--site-max-width), calc(100vw - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 1.6rem) 0 0;
  display: grid;
  gap: 0.95rem;
`;

const SectionHeader = styled.header`
  display: grid;
  gap: 0.35rem;
`;

const Title = styled.h2`
  max-width: 20ch;
  font-size: clamp(1.55rem, 2.45vw, 2.35rem);
  color: ${({ theme }) => theme.text.primary};
  text-wrap: pretty;
`;

const ErrorCard = styled.div`
  ${panelStyles}
  padding: 1rem 1.1rem;
  color: #ffb2a6;
  border-color: rgba(255, 178, 166, 0.24);
  background: rgba(140, 44, 32, 0.18);
`;

const SectionBlock = styled.div`
  ${panelStyles}
  padding: 1.5rem;
  display: grid;
  gap: 0.9rem;
`;

const FilterRail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const FilterButton = styled.button`
  min-height: 38px;
  padding: 0.5rem 0.8rem;
  border-radius: 0;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.borderStrong : theme.border)};
  background: ${({ theme, $active }) => ($active ? theme.accentSurface : 'rgba(255, 255, 255, 0.03)')};
  color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
  cursor: pointer;
  font-size: 0.68rem;
  font-family: 'Roboto Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const ArchiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ArchiveLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const ArchiveCard = styled.article`
  position: relative;
  aspect-ratio: 1 / 0.78;
  overflow: hidden;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);
`;

const ArchiveImage = styled.div`
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  ${ArchiveLink}:hover & img {
    transform: scale(1.04);
    filter: brightness(0.6);
  }
`;

const ArchiveOverlay = styled.div`
  position: absolute;
  inset: 0;
  padding: 1rem;
  display: flex;
  align-items: end;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.78));
`;

const ArchiveTitle = styled.h4`
  width: 100%;
  color: white;
  text-align: left;
  font-size: 0.98rem;
  line-height: 1.2;
`;

const EmptyState = styled.div`
  min-height: 180px;
  display: grid;
  place-items: center;
  border-radius: 0;
  border: 1px dashed ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
  padding: 1rem;
`;
