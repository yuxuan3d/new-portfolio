import React, { memo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useSanityData } from '../hooks/useSanityData';
import { urlFor } from '../lib/sanityClient';
import { MEDIA } from '../styles/breakpoints';
import LoadingState from './LoadingState';

const QUERY = `
  *[_type == "portfolioItem" && slug.current == $slug][0] {
    _id,
    title,
    mainImage,
    additionalImages,
    description,
    videoEmbeds[] {
      embedCode
    },
    "arsenal": arsenal[]{
      "name": name
    },
    tags
  }
`;

const VideoEmbed = memo(function VideoEmbed({ embedCode }) {
  return (
    <VideoContainer>
      <VideoWrapper dangerouslySetInnerHTML={{ __html: embedCode }} />
    </VideoContainer>
  );
});

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, error, { isValidating }] = useSanityData(QUERY, { slug });

  if (error) {
    return (
      <Page>
        <BackLink to="/#works">Back to Works</BackLink>
        <ErrorCard>{error}</ErrorCard>
      </Page>
    );
  }

  if (isValidating && !project) {
    return (
      <Page>
        <LoadingState label="Loading Project" minHeight="360px" margin="0" />
      </Page>
    );
  }

  if (!project) {
    return (
      <Page>
        <BackLink to="/#works">Back to Works</BackLink>
        <EmptyCard>Project not found.</EmptyCard>
      </Page>
    );
  }

  return (
    <Page>
      <BackLink to="/#works">Back to Works</BackLink>

      <Hero>
        <Eyebrow>Project Detail</Eyebrow>
        <Title>{project.title}</Title>
        {Array.isArray(project.tags) && project.tags.length > 0 ? (
          <TagRow>
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagRow>
        ) : null}
      </Hero>

      {project.mainImage ? (
        <MainImage>
          <img
            src={urlFor(project.mainImage).auto('format').width(1600).fit('max').quality(90).url()}
            alt={project.title}
            loading="eager"
          />
        </MainImage>
      ) : null}

      <ContentGrid>
        <DescriptionPanel>
          <BlockLabel>Overview</BlockLabel>
          <SectionTitle>Project Description</SectionTitle>
          {project.description ? <Description>{project.description}</Description> : null}

          {Array.isArray(project.arsenal) && project.arsenal.length > 0 ? (
            <>
              <SectionTitle>The Arsenal</SectionTitle>
              <ToolList>
                {project.arsenal.map((tool) => (
                  <Tool key={tool.name}>{tool.name}</Tool>
                ))}
              </ToolList>
            </>
          ) : null}
        </DescriptionPanel>

        <MediaPanel>
          <BlockLabel>Embedded Media</BlockLabel>
          {Array.isArray(project.videoEmbeds) && project.videoEmbeds.length > 0 ? (
            <VideoStack>
              {project.videoEmbeds.map((video, index) => (
                <VideoEmbed key={`${project._id}-video-${index}`} embedCode={video.embedCode} />
              ))}
            </VideoStack>
          ) : (
            <EmptyMedia>No embedded videos for this project.</EmptyMedia>
          )}
        </MediaPanel>
      </ContentGrid>

      {Array.isArray(project.additionalImages) && project.additionalImages.length > 0 ? (
        <GalleryPanel>
          <BlockLabel>Gallery</BlockLabel>
          <GalleryGrid>
            {project.additionalImages.map((image, index) => (
              <GalleryItem key={`${project._id}-image-${index}`}>
                <img
                  src={urlFor(image).auto('format').fit('max').quality(90).url()}
                  alt={`${project.title} still ${index + 1}`}
                  loading="lazy"
                />
              </GalleryItem>
            ))}
          </GalleryGrid>
        </GalleryPanel>
      ) : null}
    </Page>
  );
}

const panelStyles = css`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 100%),
    ${({ theme }) => theme.surface};
  box-shadow: 0 18px 44px ${({ theme }) => theme.shadowStrong};

  ${MEDIA.tabletDown} {
    border-radius: 18px;
  }

  ${MEDIA.phone} {
    border-radius: 14px;
  }
`;

const Page = styled.div`
  width: min(var(--site-max-width), calc(100% - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: calc(var(--site-header-height, 96px) + clamp(1.1rem, 3vw, 2rem)) 0 4rem;
  display: grid;
  gap: 1rem;
`;

const BackLink = styled(Link)`
  width: fit-content;
  min-height: 42px;
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  text-decoration: none;
  color: ${({ theme }) => theme.text.primary};
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.76rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Hero = styled.header`
  ${panelStyles}
  padding: var(--panel-padding);
  display: grid;
  gap: 0.6rem;
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.accent};
  font-size: 0.78rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: clamp(1.95rem, 6vw, 4.8rem);
  color: ${({ theme }) => theme.text.primary};
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const Tag = styled.span`
  min-height: 30px;
  padding: 0.42rem 0.62rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.72rem;
  font-family: 'IBM Plex Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const MainImage = styled.div`
  ${panelStyles}
  padding: 0.45rem;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    max-height: 720px;
    object-fit: cover;
    border-radius: 20px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.92fr);
  gap: 1rem;

  ${MEDIA.tabletDown} {
    grid-template-columns: 1fr;
  }
`;

const DescriptionPanel = styled.section`
  ${panelStyles}
  min-width: 0;
  padding: var(--panel-padding);
  display: grid;
  gap: 0.85rem;
`;

const MediaPanel = styled.aside`
  ${panelStyles}
  min-width: 0;
  padding: var(--panel-padding);
  display: grid;
  align-content: start;
  gap: 0.85rem;
`;

const BlockLabel = styled.p`
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.74rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const ToolList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`;

const Tool = styled.span`
  min-height: 32px;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.74rem;
  font-family: 'IBM Plex Mono', monospace;
`;

const VideoStack = styled.div`
  display: grid;
  gap: 0.9rem;
`;

const VideoContainer = styled.div`
  width: 100%;
`;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  background: rgba(0, 0, 0, 0.24);

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const EmptyMedia = styled.div`
  min-height: 200px;
  border-radius: 18px;
  border: 1px dashed ${({ theme }) => theme.border};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
  padding: 1rem;
`;

const GalleryPanel = styled.section`
  ${panelStyles}
  padding: var(--panel-padding);
  display: grid;
  gap: 0.9rem;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.9rem;

  ${MEDIA.phone} {
    grid-template-columns: 1fr;
  }
`;

const GalleryItem = styled.div`
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ErrorCard = styled.div`
  ${panelStyles}
  padding: 1rem 1.1rem;
  color: #ffb2a6;
  border-color: rgba(255, 178, 166, 0.24);
  background: rgba(140, 44, 32, 0.18);
`;

const EmptyCard = styled.div`
  ${panelStyles}
  min-height: 180px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.text.secondary};
  padding: 1rem;
`;
