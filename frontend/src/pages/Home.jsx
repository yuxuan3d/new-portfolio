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
    'I design cinematic digital experiences across Houdini/VFX, motion design, and modern web systems with a focus on clarity, craft, and performance.'
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

  const featuredList = featuredItems;
  const metricsLoading = isValidating && !items;

  return (
    <Page>
      <Hero>
        <HeroText>
          <Kicker>
            Hi, I&apos;m <KickerHighlight>Yu Xuan</KickerHighlight>
          </Kicker>
          <HeroSubtitle>{HERO_COPY.subtitle}</HeroSubtitle>
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
      </Hero>

      <SectionSeparator aria-hidden="true" />

      <Section>
        <SectionHeading>
          <SectionTitle>Featured Work</SectionTitle>
          <SectionSubtitle>Selected work, crafted for clarity and impact.</SectionSubtitle>
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

      <SectionSeparator aria-hidden="true" />

      <Section>
        <SectionHeading>
          <SectionTitle>All Projects</SectionTitle>
          <SectionSubtitle>Browse the full project library.</SectionSubtitle>
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
  padding: 0 0 4.3rem;
  position: relative;

  @media (max-width: 720px) {
    padding: 0 0 3rem;
  }
`;

const Hero = styled.section`
  --hero-header-offset: var(--site-header-height, clamp(72px, 8vw, 108px));
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  margin-top: calc(var(--hero-header-offset) * -1);
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.72rem;
  place-items: center;
  align-items: center;
  margin-bottom: 0;
  position: relative;
  min-height: 100svh;
  min-height: 100dvh;
  padding:
    calc(clamp(1rem, 2.4vw, 1.8rem) + var(--hero-header-offset))
    6vw
    clamp(1rem, 2.4vw, 1.8rem);
  background:
    radial-gradient(
      72rem 34rem at 50% 46%,
      rgba(126, 89, 212, 0.34) 0%,
      rgba(80, 55, 164, 0.24) 34%,
      rgba(30, 28, 65, 0.1) 56%,
      rgba(6, 12, 26, 0) 74%
    ),
    radial-gradient(
      44rem 24rem at 10% 10%,
      rgba(46, 99, 183, 0.2) 0%,
      rgba(46, 99, 183, 0) 74%
    ),
    radial-gradient(
      44rem 24rem at 88% 12%,
      rgba(84, 164, 224, 0.14) 0%,
      rgba(84, 164, 224, 0) 74%
    ),
    linear-gradient(
      180deg,
      rgba(13, 14, 35, 0.98) 0%,
      rgba(9, 11, 30, 0.98) 62%,
      rgba(3, 8, 19, 1) 100%
    );

  @media (max-width: 900px) {
    --hero-header-offset: var(--site-header-height, clamp(68px, 14vw, 92px));
    gap: 0.66rem;
    padding:
      calc(0.9rem + var(--hero-header-offset))
      6vw
      0.9rem;
  }
`;

const HeroText = styled.div`
  max-width: min(980px, 100%);
  padding: 0;
  margin: 0 auto;
  text-align: center;
  display: grid;
  gap: clamp(0.45rem, 1.5vw, 0.8rem);
  justify-items: center;
`;

const Kicker = styled.h1`
  margin: 0;
  font-family: 'Red Hat Display', 'Segoe UI', sans-serif;
  font-weight: 800;
  text-transform: none;
  letter-spacing: -0.028em;
  color: ${({ theme }) => theme.text.primary};
  font-size: clamp(2.45rem, 6.5vw, 5.4rem);
  line-height: 0.96;
  text-wrap: balance;
  max-width: 15ch;
`;

const KickerHighlight = styled.span`
  color: ${({ theme }) => theme.accent};
  display: inline-block;
  font-family: inherit;
  font-style: normal;
  font-weight: inherit;

  @supports ((-webkit-background-clip: text) or (background-clip: text)) {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.accent} 0%,
      ${({ theme }) => theme.accentAlt || theme.accent} 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: clamp(1rem, 1.7vw, 1.26rem);
  line-height: 1.56;
  color: ${({ theme }) => theme.text.secondary};
  max-width: 52ch;
`;

const AvailabilityPill = styled.p`
  display: inline-flex;
  margin: 0;
  padding: 0.42rem 0.86rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}16`};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.66rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.15rem;
`;

const PrimaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 10.75rem;
  padding: 0.86rem 1.36rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.text};
  box-shadow: 0 10px 24px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.button.hover || theme.accent};
    transform: translateY(-2px);
    filter: saturate(0.94);
    box-shadow: 0 14px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.22)'};
  }
`;

const SecondaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 7.6rem;
  padding: 0.84rem 1.2rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 10px 24px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};
  }
`;

const TextCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.82rem 0.62rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid transparent;
  font-size: 0.9rem;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
    border-color: ${({ theme }) => theme.border};
    text-decoration: none;
  }
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

const Section = styled.section`
  margin-top: 0;
`;

const SectionSeparator = styled.div`
  height: 1px;
  margin: 2.3rem 0 2.15rem;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${({ theme }) => theme.border} 14%,
    ${({ theme }) => theme.accentSoft || `${theme.accent}24`} 50%,
    ${({ theme }) => theme.border} 86%,
    transparent 100%
  );
  opacity: 1;

  @media (max-width: 720px) {
    margin: 1.7rem 0 1.6rem;
  }
`;

const SectionHeading = styled.header`
  margin-bottom: 1.2rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.28rem;
  font-size: clamp(1.5rem, 2.8vw, 2.2rem);
  font-weight: 680;
  line-height: 1.08;
  color: ${({ theme }) => theme.text.primary};
`;

const SectionSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 540;
  font-size: 0.96rem;
`;

const FilterRail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.48rem;
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
    $active ? theme.accentSoft || `${theme.accent}24` : theme.surfaceAlt || theme.surface};
  color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
  border-radius: 999px;
  padding: 0.42rem 0.82rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedSkeletonCard = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  box-shadow: 0 10px 26px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};
`;

const FeaturedCardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  border-radius: 14px;
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
  aspect-ratio: 16 / 10;
  width: 100%;
  overflow: hidden;
`;

const FeaturedBody = styled.div`
  padding: 0.9rem 0.9rem 1.05rem;
`;

const FeaturedTitle = styled.h3`
  margin: 0 0 0.7rem;
  font-size: 1.18rem;
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
  color: ${({ theme }) => theme.text.primary};
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  padding: 0.8rem 0 0;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.15rem;
  }
`;

const TileSkeleton = styled.div`
  border-radius: 12px;
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
  padding-bottom: 64%;
  overflow: hidden;
  border-radius: 12px;
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
    filter: brightness(0.45);
  }
`;

const TileOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 1rem;
  opacity: 1;
  transition: background 0.25s ease;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 44%,
    rgba(0, 0, 0, 0.74) 100%
  );

  ${Tile}:hover & {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.05) 36%,
      rgba(0, 0, 0, 0.84) 100%
    );
  }

  ${TileLink}:focus-visible & {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.05) 36%,
      rgba(0, 0, 0, 0.84) 100%
    );
  }

  @media (hover: none) {
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
  font-size: 1.08rem;
  font-weight: 700;
  text-align: left;
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

const ErrorBlock = styled.div`
  padding: 1.2rem;
  border-radius: 14px;
  border: 1px solid rgba(212, 72, 65, 0.45);
  background: rgba(212, 72, 65, 0.1);
  color: #d44841;
  font-weight: 700;
`;
