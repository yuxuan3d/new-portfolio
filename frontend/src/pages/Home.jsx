import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import LazyImage from '../components/LazyImage';
import { EXTERNAL_LINKS } from '../constants/social';
import { useSanityData } from '../hooks/useSanityData';
import { urlFor } from '../lib/sanityClient';

const HERO_COPY = {
  kicker: "Hi, I'm Yu Xuan",
  subtitle:
    'I craft visual experiences across Houdini/VFX, motion design, and modern web (Three.js/React), exploring AI-assisted workflows along the way.',
  availability: 'Open to freelance collaborations and full-time opportunities.',
};

const PROJECTS_QUERY = `*[_type == "portfolioItem"] | order(orderRank) {
  _id,
  title,
  slug,
  mainImage,
  tags,
  featured
}`;
const FEATURED_SKELETON_COUNT = 3;
const PROJECTS_SKELETON_COUNT = 8;
function getTagPreview(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.slice(0, 2);
}

function getTopTags(projects, limit = 8) {
  const tagCounts = new Map();

  projects.forEach((project) => {
    if (!Array.isArray(project.tags)) return;
    project.tags.forEach((tag) => {
      if (!tag) return;
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

export default function Home() {
  const [items, error, { isValidating }] = useSanityData(PROJECTS_QUERY);
  const [activeTag, setActiveTag] = useState('All');

  const projects = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const featuredCandidates = useMemo(
    () => projects.filter((project) => Boolean(project.featured)),
    [projects],
  );
  const featuredItems = useMemo(
    () => (featuredCandidates.length > 0 ? featuredCandidates : projects).slice(0, 4),
    [featuredCandidates, projects],
  );
  const featuredIds = useMemo(
    () => new Set(featuredItems.map((project) => project._id)),
    [featuredItems],
  );
  const allItems = useMemo(
    () => projects.filter((project) => !featuredIds.has(project._id)),
    [projects, featuredIds],
  );
  const topTags = useMemo(() => getTopTags(projects), [projects]);
  const filteredAllItems = useMemo(() => {
    if (activeTag === 'All') {
      return allItems;
    }

    return allItems.filter((project) => Array.isArray(project.tags) && project.tags.includes(activeTag));
  }, [activeTag, allItems]);

  useEffect(() => {
    if (activeTag === 'All') return;

    const tagStillExists = topTags.includes(activeTag);
    if (!tagStillExists) {
      setActiveTag('All');
    }
  }, [activeTag, topTags]);

  const spotlight = featuredItems[0];
  const featuredList = featuredItems.slice(1);
  const metricsLoading = isValidating && !items;

  return (
    <Page>
      <Hero>
        <HeroText>
          <Kicker>{HERO_COPY.kicker}</Kicker>
          <HeroSubtitle>{HERO_COPY.subtitle}</HeroSubtitle>
          <AvailabilityPill>{HERO_COPY.availability}</AvailabilityPill>

          <CtaRow>
            <PrimaryCta
              href={EXTERNAL_LINKS.RESUME}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </PrimaryCta>
            <SecondaryCta to="/contact">Contact</SecondaryCta>
            <TextCta to="/rnd">Latest R&amp;D -&gt;</TextCta>
          </CtaRow>
        </HeroText>

        <SpotlightWrap aria-label="Featured spotlight">
          {spotlight ? (
            <SpotlightLink to={`/project/${spotlight.slug.current}`}>
              <SpotlightMedia>
                <LazyImage
                  src={urlFor(spotlight.mainImage)
                    .auto('format')
                    .width(1400)
                    .height(900)
                    .fit('crop')
                    .quality(90)
                    .url()}
                  alt={spotlight.title}
                  sizes="(max-width: 900px) 100vw, 40vw"
                />
              </SpotlightMedia>
              <SpotlightBody>
                <SpotlightLabel>Featured Spotlight</SpotlightLabel>
                <SpotlightTitle>{spotlight.title}</SpotlightTitle>
                {getTagPreview(spotlight.tags).length > 0 && (
                  <TagRow aria-label="Project tags">
                    {getTagPreview(spotlight.tags).map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </TagRow>
                )}
                <SpotlightCta>View Project</SpotlightCta>
              </SpotlightBody>
            </SpotlightLink>
          ) : (
            <SpotlightPlaceholder>
              {error ? (
                <ErrorText>{error}</ErrorText>
              ) : (
                <SpotlightSkeleton aria-hidden="true">
                  <SkeletonMedia />
                  <SkeletonLine />
                  <SkeletonLine $width="64%" />
                  <SkeletonTagRow>
                    <SkeletonTag />
                    <SkeletonTag />
                  </SkeletonTagRow>
                </SpotlightSkeleton>
              )}
            </SpotlightPlaceholder>
          )}
        </SpotlightWrap>
      </Hero>

      <Section>
        <SectionHeading>
          <SectionTitle>Featured Work</SectionTitle>
          <SectionSubtitle>Curated highlights.</SectionSubtitle>
        </SectionHeading>

        {error ? (
          <ErrorBlock>{error}</ErrorBlock>
        ) : isValidating && !items ? (
          <FeaturedGrid aria-label="Loading featured projects">
            {Array.from({ length: FEATURED_SKELETON_COUNT }).map((_, index) => (
              <FeaturedSkeletonCard key={`featured-skeleton-${index}`}>
                <SkeletonMedia />
                <FeaturedBody>
                  <SkeletonLine />
                  <SkeletonLine $width="62%" />
                </FeaturedBody>
              </FeaturedSkeletonCard>
            ))}
          </FeaturedGrid>
        ) : featuredList.length > 0 ? (
          <FeaturedGrid>
            {featuredList.map((project) => (
              <FeaturedCardLink to={`/project/${project.slug.current}`} key={project._id}>
                <FeaturedMedia>
                  <LazyImage
                    src={urlFor(project.mainImage)
                      .auto('format')
                      .width(900)
                      .height(700)
                      .fit('crop')
                      .quality(90)
                      .url()}
                    alt={project.title}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </FeaturedMedia>
                <FeaturedBody>
                  <FeaturedTitle>{project.title}</FeaturedTitle>
                  {getTagPreview(project.tags).length > 0 && (
                    <TagRow aria-label="Project tags">
                      {getTagPreview(project.tags).map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </TagRow>
                  )}
                </FeaturedBody>
              </FeaturedCardLink>
            ))}
          </FeaturedGrid>
        ) : (
          <EmptyState>
            <p>No featured projects yet.</p>
          </EmptyState>
        )}
      </Section>

      <Section>
        <SectionHeading>
          <SectionTitle>All Projects</SectionTitle>
          <SectionSubtitle>Explore the full archive.</SectionSubtitle>
        </SectionHeading>

        {!error && !metricsLoading && allItems.length > 0 && (
          <FilterRail role="toolbar" aria-label="Filter all projects by tag">
            <FilterButton
              type="button"
              $active={activeTag === 'All'}
              onClick={() => setActiveTag('All')}
            >
              All ({allItems.length})
            </FilterButton>
            {topTags.map((tag) => (
              <FilterButton
                key={tag}
                type="button"
                $active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </FilterButton>
            ))}
          </FilterRail>
        )}

        {error ? (
          <ErrorBlock>{error}</ErrorBlock>
        ) : isValidating && !items ? (
          <>
            <LoadingHint>Loading project archive...</LoadingHint>
            <ProjectsGrid aria-label="Loading projects">
              {Array.from({ length: PROJECTS_SKELETON_COUNT }).map((_, index) => (
                <TileSkeleton key={`project-skeleton-${index}`}>
                  <SkeletonMedia />
                </TileSkeleton>
              ))}
            </ProjectsGrid>
          </>
        ) : filteredAllItems.length > 0 ? (
          <ProjectsGrid aria-label="All projects">
            {filteredAllItems.map((project) => (
              <TileLink to={`/project/${project.slug.current}`} key={project._id}>
                <Tile>
                  <LazyImage
                    src={urlFor(project.mainImage)
                      .auto('format')
                      .width(900)
                      .height(900)
                      .fit('crop')
                      .quality(90)
                      .url()}
                    alt={project.title}
                    sizes="(max-width: 380px) 100vw,
                           (max-width: 800px) 50vw,
                           (max-width: 1100px) 33vw,
                           (max-width: 1600px) 25vw,
                           20vw"
                  />
                  <TileOverlay>
                    <TileTitle>{project.title}</TileTitle>
                  </TileOverlay>
                </Tile>
              </TileLink>
            ))}
          </ProjectsGrid>
        ) : (
          <EmptyState>
            <p>
              {activeTag === 'All'
                ? 'No projects found.'
                : `No projects found for ${activeTag}.`}
            </p>
            {activeTag !== 'All' && (
              <ResetFilterButton type="button" onClick={() => setActiveTag('All')}>
                Show all projects
              </ResetFilterButton>
            )}
          </EmptyState>
        )}
      </Section>
    </Page>
  );
}

const shimmer = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: -100% 50%;
  }
`;

const Page = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.8rem 0 4.5rem;
  position: relative;

  @media (max-width: 720px) {
    padding: 2rem 0 3.2rem;
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2.8rem;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  box-shadow: 0 18px 42px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};
  padding: 1.7rem;
  backdrop-filter: blur(8px);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.08) 45%, transparent 100%);
    pointer-events: none;
    z-index: -1;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.4rem;
    padding: 1.2rem;
  }
`;

const HeroText = styled.div`
  max-width: 640px;
  padding: 0.4rem 0.4rem 0.4rem 0.2rem;
`;

const Kicker = styled.h1`
  margin: 0 0 1rem;
  font-family: 'Red Hat Display', 'Segoe UI', sans-serif;
  font-weight: 800;
  text-transform: none;
  letter-spacing: -0.032em;
  color: ${({ theme }) => theme.accent};
  font-size: clamp(2.8rem, 7.8vw, 5.15rem);
  line-height: 0.93;
  text-wrap: balance;

  /* Gradient-text technique for the colored greeting. */
  @supports ((-webkit-background-clip: text) or (background-clip: text)) {
    background: linear-gradient(
      92deg,
      ${({ theme }) => theme.accent} 0%,
      #53b9f8 52%,
      #7b9bff 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0 0 1.75rem;
  font-size: 1.12rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text.secondary};
  max-width: 57ch;
`;

const AvailabilityPill = styled.p`
  display: inline-flex;
  margin: 0 0 1.2rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}18`};
  color: ${({ theme }) => theme.accent};
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const PrimaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1.35rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.01em;
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.text};
  box-shadow: 0 10px 24px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.button.hover};
    transform: translateY(-2px);
    box-shadow: 0 14px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.22)'};
  }
`;

const SecondaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.accent};
  }
`;

const TextCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 0.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};

  &:hover {
    text-decoration: underline;
  }
`;

const SpotlightWrap = styled.div`
  width: 100%;
`;

const SpotlightLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: grid;
  grid-template-rows: auto 1fr;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  box-shadow: 0 14px 34px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 46px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.focus || `${theme.accent}66`};
    outline-offset: 4px;
  }
`;

const SpotlightMedia = styled.div`
  aspect-ratio: 16 / 10;
  width: 100%;
  overflow: hidden;
`;

const SpotlightBody = styled.div`
  padding: 1.3rem 1.3rem 1.45rem;
`;

const SpotlightLabel = styled.p`
  margin: 0 0 0.4rem;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.accent};
`;

const SpotlightTitle = styled.h2`
  margin: 0 0 0.9rem;
  font-size: 1.55rem;
  color: ${({ theme }) => theme.text.primary};
`;

const SpotlightCta = styled.div`
  margin-top: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.accent};
`;

const SpotlightPlaceholder = styled.div`
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  padding: 1.3rem;
`;

const SpotlightSkeleton = styled.div`
  display: grid;
  gap: 0.9rem;
`;

const SkeletonMedia = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: linear-gradient(
    110deg,
    ${({ theme }) => theme.surfaceAlt || theme.surface} 8%,
    ${({ theme }) => theme.accentSoft || `${theme.accent}1f`} 18%,
    ${({ theme }) => theme.surfaceAlt || theme.surface} 33%
  );
  background-size: 240% 100%;
  animation: ${shimmer} 1.6s linear infinite;
`;

const SkeletonLine = styled.div`
  width: ${({ $width }) => $width || '100%'};
  height: 0.9rem;
  border-radius: 999px;
  background: linear-gradient(
    110deg,
    ${({ theme }) => theme.surfaceAlt || theme.surface} 8%,
    ${({ theme }) => theme.accentSoft || `${theme.accent}1f`} 18%,
    ${({ theme }) => theme.surfaceAlt || theme.surface} 33%
  );
  background-size: 240% 100%;
  animation: ${shimmer} 1.6s linear infinite;
`;

const SkeletonTagRow = styled.div`
  display: flex;
  gap: 0.45rem;
`;

const SkeletonTag = styled.div`
  width: 5rem;
  height: 1.2rem;
  border-radius: 999px;
  background: linear-gradient(
    110deg,
    ${({ theme }) => theme.surfaceAlt || theme.surface} 8%,
    ${({ theme }) => theme.accentSoft || `${theme.accent}1f`} 18%,
    ${({ theme }) => theme.surfaceAlt || theme.surface} 33%
  );
  background-size: 240% 100%;
  animation: ${shimmer} 1.6s linear infinite;
`;

const Section = styled.section`
  margin-top: 2.2rem;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 22px;
  padding: 1.45rem 1.35rem 1.5rem;
  box-shadow: 0 12px 32px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};

  &::before {
    content: '';
    position: absolute;
    left: 1.35rem;
    right: 1.35rem;
    top: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${({ theme }) => theme.accentSoft || `${theme.accent}33`} 24%,
      ${({ theme }) => theme.accentSoft || `${theme.accent}33`} 76%,
      transparent 100%
    );
  }

  @media (max-width: 720px) {
    padding: 1.15rem 1rem 1.2rem;
  }
`;

const SectionHeading = styled.header`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

const SectionSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

const FilterRail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin: 0 0 1rem;
`;

const LoadingHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.92rem;
  font-weight: 600;
`;

const FilterButton = styled.button`
  border: 1px solid ${({ theme, $active }) => ($active ? theme.accent : theme.border)};
  background: ${({ theme, $active }) =>
    $active ? theme.accentSoft || `${theme.accent}28` : theme.surfaceAlt || theme.surface};
  color: ${({ theme, $active }) => ($active ? theme.accent : theme.text.secondary)};
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
  }
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedSkeletonCard = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  box-shadow: 0 10px 26px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};
`;

const FeaturedCardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 26px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.focus || `${theme.accent}66`};
    outline-offset: 4px;
  }
`;

const FeaturedMedia = styled.div`
  aspect-ratio: 4 / 3;
  width: 100%;
  overflow: hidden;
`;

const FeaturedBody = styled.div`
  padding: 1rem 1rem 1.1rem;
`;

const FeaturedTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text.primary};
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
  color: ${({ theme }) => theme.accent};
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.15rem;
  padding: 0.8rem 0 0;

  @media (min-width: 1600px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

const TileSkeleton = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 10px 26px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};
`;

const TileLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 4px;
    border-radius: 12px;
  }
`;

const Tile = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  border-radius: 14px;
  cursor: pointer;
  background: ${({ theme }) => theme.card.background};
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 10px 26px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.22)'};
  }

  & > div {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: filter 0.25s ease;
  }

  &:hover img {
    filter: brightness(0.36);
  }
`;

const TileOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.25s ease;

  ${Tile}:hover & {
    opacity: 1;
  }

  ${TileLink}:focus-visible & {
    opacity: 1;
  }

  @media (hover: none) {
    opacity: 1;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 0.9rem;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 35%,
      rgba(0, 0, 0, 0.72) 100%
    );
  }
`;

const TileTitle = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  text-align: center;
  color: white;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);

  @media (hover: none) {
    text-align: left;
    font-size: 1rem;
  }
`;

const EmptyState = styled.div`
  padding: 2rem 0;
  color: ${({ theme }) => theme.text.secondary};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 14px;
  text-align: center;
  display: grid;
  gap: 0.9rem;
  justify-items: center;
`;

const ResetFilterButton = styled.button`
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  color: ${({ theme }) => theme.text.primary};
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.accent};
  }
`;

const ErrorText = styled.div`
  color: #d44841;
  font-weight: 700;
`;

const ErrorBlock = styled.div`
  padding: 1.2rem;
  border-radius: 14px;
  border: 1px solid rgba(212, 72, 65, 0.45);
  background: rgba(212, 72, 65, 0.1);
  color: #d44841;
  font-weight: 700;
`;
