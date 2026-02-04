import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LoadingState from '../components/LoadingState';
import LazyImage from '../components/LazyImage';
import { EXTERNAL_LINKS } from '../constants/social';
import { useSanityData } from '../hooks/useSanityData';
import { urlFor } from '../lib/sanityClient';

const HERO_COPY = {
  kicker: 'Hi, I’m Yu Xuan',
  title: '3D, motion, and interactive experiments.',
  subtitle:
    'I craft visual experiences across Houdini/VFX, motion design, and modern web (Three.js/React), exploring AI-assisted workflows along the way.',
};

const PROJECTS_QUERY = `*[_type == "portfolioItem"] | order(orderRank) {
  _id,
  title,
  slug,
  mainImage,
  tags,
  featured
}`;

function getTagPreview(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.slice(0, 2);
}

export default function Home() {
  const [items, error, { isValidating }] = useSanityData(PROJECTS_QUERY);

  const projects = Array.isArray(items) ? items : [];
  const featuredCandidates = projects.filter((project) => Boolean(project.featured));
  const featuredItems = (featuredCandidates.length > 0 ? featuredCandidates : projects).slice(0, 4);
  const featuredIds = new Set(featuredItems.map((project) => project._id));
  const allItems = projects.filter((project) => !featuredIds.has(project._id));

  const spotlight = featuredItems[0];
  const featuredList = featuredItems.slice(1);

  return (
    <Page>
      <Hero>
        <HeroText>
          <Kicker>{HERO_COPY.kicker}</Kicker>
          <HeroTitle>{HERO_COPY.title}</HeroTitle>
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
            <TextCta to="/rnd">Latest R&amp;D →</TextCta>
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
                <LoadingState label="Loading Featured Work" minHeight="260px" margin="0" />
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
          <LoadingState label="Loading Featured Work" minHeight="240px" />
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

        {error ? (
          <ErrorBlock>{error}</ErrorBlock>
        ) : isValidating && !items ? (
          <LoadingState label="Loading Projects" />
        ) : allItems.length > 0 ? (
          <ProjectsGrid aria-label="All projects">
            {allItems.map((project) => (
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
            <p>No projects found.</p>
          </EmptyState>
        )}
      </Section>
    </Page>
  );
}

const Page = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3.5rem 0 4.5rem;

  @media (max-width: 720px) {
    padding: 2.5rem 0 3.5rem;
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 4rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const HeroText = styled.div`
  max-width: 640px;
`;

const Kicker = styled.p`
  margin: 0 0 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.text.secondary};
`;

const HeroTitle = styled.h1`
  margin: 0 0 1rem;
  font-size: clamp(2.1rem, 4vw, 3.2rem);
  line-height: 1.1;
  color: ${({ theme }) => theme.text.primary};
`;

const HeroSubtitle = styled.p`
  margin: 0 0 1.75rem;
  font-size: 1.15rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text.secondary};
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
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.text};
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.button.hover};
    transform: translateY(-1px);
  }
`;

const SecondaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.25rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  background: ${({ theme }) => theme.card.background};
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
  font-weight: 600;
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
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
    outline-offset: 4px;
  }
`;

const SpotlightMedia = styled.div`
  aspect-ratio: 16 / 10;
  width: 100%;
  overflow: hidden;
`;

const SpotlightBody = styled.div`
  padding: 1.25rem 1.25rem 1.4rem;
`;

const SpotlightLabel = styled.p`
  margin: 0 0 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
`;

const SpotlightTitle = styled.h2`
  margin: 0 0 0.9rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

const SpotlightCta = styled.div`
  margin-top: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
`;

const SpotlightPlaceholder = styled.div`
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  padding: 1.5rem;
`;

const Section = styled.section`
  margin-top: 3.5rem;
`;

const SectionHeading = styled.header`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 0.25rem;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.text.primary};
`;

const SectionSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedCardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.accent};
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
  font-size: 1.15rem;
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
  font-size: 0.85rem;
  font-weight: 600;
  background: ${({ theme }) => `${theme.accent}20`};
  color: ${({ theme }) => theme.accent};
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem;
  padding: 1rem 0 0;

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
  border-radius: 12px;
  cursor: pointer;
  background: ${({ theme }) => theme.card.background};
  transition: transform 0.25s ease;

  &:hover {
    transform: scale(1.015);
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
    filter: brightness(0.3);
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
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-weight: 600;
`;

const ErrorBlock = styled.div`
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(231, 76, 60, 0.4);
  background: rgba(231, 76, 60, 0.08);
  color: #e74c3c;
  font-weight: 700;
`;
