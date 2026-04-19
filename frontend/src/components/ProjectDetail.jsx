import React, { memo, useCallback, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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

function getIframeSource(value) {
  if (typeof value !== 'string') return null;

  if (typeof DOMParser !== 'undefined') {
    const document = new DOMParser().parseFromString(value, 'text/html');
    const iframe = document.querySelector('iframe[src]');
    return iframe?.getAttribute('src') || null;
  }

  const match = value.match(/<iframe\b[^>]*\bsrc=(["']?)([^"'\s>]+)\1/i);
  return match?.[2] || null;
}

function getYouTubeVideoId(url) {
  const host = url.hostname.replace(/^www\./, '').toLowerCase();

  if (host === 'youtu.be') {
    return url.pathname.split('/').filter(Boolean)[0] || null;
  }

  if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      return url.searchParams.get('v');
    }

    const [, route, videoId] = url.pathname.split('/');
    if (route === 'embed' || route === 'shorts') {
      return videoId || null;
    }
  }

  return null;
}

function getVimeoVideoId(url) {
  const host = url.hostname.replace(/^www\./, '').toLowerCase();
  const pathParts = url.pathname.split('/').filter(Boolean);

  if (host === 'player.vimeo.com' && pathParts[0] === 'video') {
    return /^\d+$/.test(pathParts[1] || '') ? pathParts[1] : null;
  }

  if (host === 'vimeo.com') {
    return /^\d+$/.test(pathParts[0] || '') ? pathParts[0] : null;
  }

  return null;
}

function buildEmbedUrl(baseUrl, sourceUrl, allowedParams = []) {
  const embedUrl = new URL(baseUrl);

  allowedParams.forEach((param) => {
    const value = sourceUrl.searchParams.get(param);
    if (value) {
      embedUrl.searchParams.set(param, value);
    }
  });

  return embedUrl.toString();
}

function getSafeVideoEmbed(embedCode) {
  const rawValue = typeof embedCode === 'string' ? embedCode.trim() : '';
  if (!rawValue) return null;

  const candidate = getIframeSource(rawValue) || rawValue;
  const normalizedCandidate = candidate.startsWith('//') ? `https:${candidate}` : candidate;
  const candidateUrl = /^[a-z][a-z\d+\-.]*:\/\//i.test(normalizedCandidate)
    ? normalizedCandidate
    : `https://${normalizedCandidate}`;

  try {
    const url = new URL(candidateUrl);
    const youtubeId = getYouTubeVideoId(url);
    if (youtubeId) {
      return {
        src: buildEmbedUrl(
          `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}`,
          url,
          ['start'],
        ),
        title: 'YouTube video player',
      };
    }

    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
      return {
        src: buildEmbedUrl(
          `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}`,
          url,
          ['h'],
        ),
        title: 'Vimeo video player',
      };
    }
  } catch {
    return null;
  }

  return null;
}

const VideoEmbed = memo(function VideoEmbed({ embedCode }) {
  const embed = getSafeVideoEmbed(embedCode);

  if (!embed) {
    return <InvalidVideoEmbed>Unsupported video embed.</InvalidVideoEmbed>;
  }

  return (
    <VideoContainer>
      <VideoWrapper>
        <iframe
          src={embed.src}
          title={embed.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </VideoWrapper>
    </VideoContainer>
  );
});

export default function ProjectDetail({ overlay = false }) {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [project, error, { isValidating }] = useSanityData(QUERY, { slug });
  const hasBackgroundLocation = Boolean(location.state?.backgroundLocation);

  const handleClose = useCallback(() => {
    if (overlay && hasBackgroundLocation) {
      navigate(-1);
      return;
    }

    navigate('/#works');
  }, [hasBackgroundLocation, navigate, overlay]);

  useEffect(() => {
    if (!overlay) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [overlay]);

  useEffect(() => {
    if (!overlay) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleClose, overlay]);

  if (error) {
    return renderProjectShell({
      overlay,
      onClose: handleClose,
      children: (
        <Page $overlay={overlay}>
          {!overlay ? <BackLink to="/#works">Back to Works</BackLink> : null}
          <ErrorCard>{error}</ErrorCard>
        </Page>
      ),
    });
  }

  if (isValidating && !project) {
    return renderProjectShell({
      overlay,
      onClose: handleClose,
      children: (
        <Page $overlay={overlay}>
          <LoadingState label="Loading Project" minHeight="360px" margin="0" />
        </Page>
      ),
    });
  }

  if (!project) {
    return renderProjectShell({
      overlay,
      onClose: handleClose,
      children: (
        <Page $overlay={overlay}>
          {!overlay ? <BackLink to="/#works">Back to Works</BackLink> : null}
          <EmptyCard>Project not found.</EmptyCard>
        </Page>
      ),
    });
  }

  return renderProjectShell({
    overlay,
    onClose: handleClose,
    children: (
      <Page $overlay={overlay}>
        {!overlay ? <BackLink to="/#works">Back to Works</BackLink> : null}

        <HeroGrid $hasImage={Boolean(project.mainImage)}>
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
        </HeroGrid>

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
    ),
  });
}

function renderProjectShell({ overlay, onClose, children }) {
  if (!overlay) return children;

  return (
    <OverlayBackdrop onClick={onClose} role="presentation">
      <OverlayDialog
        role="dialog"
        aria-modal="true"
        aria-label="Project details"
        onClick={(event) => event.stopPropagation()}
      >
        <OverlayClose type="button" onClick={onClose} aria-label="Close project">
          <FaTimes size={16} />
        </OverlayClose>
        <OverlayScroll>{children}</OverlayScroll>
      </OverlayDialog>
    </OverlayBackdrop>
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
  width: 100%;
  max-width: ${({ $overlay }) => ($overlay ? '100%' : 'min(var(--site-max-width), calc(100% - (var(--site-gutter) * 2)))')};
  margin: 0 auto;
  padding: ${({ $overlay }) =>
    $overlay ? 'clamp(1rem, 2vw, 1.35rem)' : 'calc(var(--site-header-height, 96px) + clamp(1.1rem, 3vw, 2rem)) 0 4rem'};
  display: grid;
  gap: 1rem;
`;

const OverlayBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 220;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(0.75rem, 2vw, 1.6rem);
  background: rgba(5, 6, 8, 0.68);
  backdrop-filter: blur(10px);
`;

const OverlayDialog = styled.div`
  position: relative;
  width: min(1440px, calc(100vw - (clamp(0.75rem, 2vw, 1.6rem) * 2)));
  margin: 0 auto;

  ${MEDIA.phone} {
    width: calc(100vw - 24px);
  }
`;

const OverlayScroll = styled.div`
  width: 100%;
`;

const OverlayClose = styled.button`
  position: fixed;
  top: clamp(0.85rem, 2vw, 1.2rem);
  right: clamp(0.85rem, 2vw, 1.2rem);
  z-index: 230;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: rgba(8, 10, 14, 0.82);
  color: ${({ theme }) => theme.text.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 16px 32px ${({ theme }) => theme.shadowStrong};
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

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $hasImage }) =>
    $hasImage ? 'minmax(0, 0.92fr) minmax(0, 1.08fr)' : '1fr'};
  gap: 1rem;
  align-items: stretch;

  ${MEDIA.wideUp} {
    grid-template-columns: ${({ $hasImage }) =>
      $hasImage ? 'minmax(0, 1fr) minmax(0, 0.9fr)' : '1fr'};
  }

  ${MEDIA.tabletDown} {
    grid-template-columns: 1fr;
  }
`;

const Hero = styled.header`
  ${panelStyles}
  padding: clamp(1rem, 1.8vw, 1.25rem);
  display: grid;
  gap: 0.6rem;
  align-content: center;
  min-width: 0;
  height: 100%;
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.accent};
  font-size: 0.78rem;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 3.7rem);
  line-height: 0.92;
  color: ${({ theme }) => theme.text.primary};

  ${MEDIA.wideUp} {
    font-size: clamp(1.7rem, 2.6vw, 2.9rem);
  }
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
  min-width: 0;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    min-height: clamp(220px, 15vw, 280px);
    max-height: 280px;
    object-fit: cover;
    border-radius: 20px;
  }

  ${MEDIA.tabletDown} {
    img {
      height: auto;
      min-height: 0;
      max-height: 720px;
    }
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
  align-items: center;
`;

const Tool = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 0.8rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.74rem;
  line-height: 1;
  font-family: 'IBM Plex Mono', monospace;
  white-space: nowrap;
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

const InvalidVideoEmbed = styled.div`
  min-height: 180px;
  border-radius: 18px;
  border: 1px dashed ${({ theme }) => theme.border};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
  padding: 1rem;
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
