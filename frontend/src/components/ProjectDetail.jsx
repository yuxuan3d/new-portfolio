import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSanityData } from '../hooks/useSanityData';
import useDocumentMetadata, { toCanonicalUrl } from '../hooks/useDocumentMetadata';
import { trackProjectOpen } from '../lib/siteEvents';
import { urlFor } from '../lib/sanityClient';
import { formatWorkLabel } from '../lib/workDisciplines';
import { heroPresentation } from '../lib/heroProjects';
import { SanityImage } from './home/ProjectMedia';
import { MEDIA } from '../styles/breakpoints';
import LoadingState from './LoadingState';

const QUERY = `
  *[_type == "portfolioItem" && (slug.current == $slug || $slug in legacySlugs)][0] {
    _id,
    title,
    "slug": slug.current,
    legacySlugs,
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

const PROJECT_NAV_QUERY = `
  *[_type == "portfolioItem" && defined(slug.current)] | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
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
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </VideoWrapper>
    </VideoContainer>
  );
});

export default function ProjectDetail({ overlay = false }) {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [project, error, { isValidating, hasResolved }] = useSanityData(QUERY, { slug });
  const [projectNavItems] = useSanityData(PROJECT_NAV_QUERY);
  const canonicalSlug = project?.slug || slug;
  const presentation = heroPresentation(project);
  const metadataImage = project?.mainImage
    ? urlFor(project.mainImage).width(1200).height(630).fit('crop').auto('format').url()
    : undefined;
  useDocumentMetadata({
    title: project ? `${project.title} — Yu Xuan | yxperiments` : 'Project — Yu Xuan | yxperiments',
    description: project?.description?.trim().slice(0, 160) || 'Project work by Yu Xuan.',
    canonical: project ? toCanonicalUrl(`/project/${encodeURIComponent(canonicalSlug)}`) : null,
    image: metadataImage,
    type: 'article',
    noIndex: Boolean((hasResolved || error) && !project),
  });
  const hasBackgroundLocation = Boolean(location.state?.backgroundLocation);
  const projectLinkState = overlay && hasBackgroundLocation
    ? { backgroundLocation: location.state.backgroundLocation }
    : undefined;

  const adjacentProjects = useMemo(() => {
    if (!project || !Array.isArray(projectNavItems) || projectNavItems.length < 2) {
      return [];
    }

    const currentIndex = projectNavItems.findIndex((item) => item.slug === project.slug);
    if (currentIndex === -1) return [];

    if (projectNavItems.length === 2) {
      return [
        {
          label: 'Next project',
          project: projectNavItems.find((item) => item.slug !== project.slug),
        },
      ].filter((item) => item.project?.slug);
    }

    const previousIndex = (currentIndex - 1 + projectNavItems.length) % projectNavItems.length;
    const nextIndex = (currentIndex + 1) % projectNavItems.length;

    return [
      { label: 'Previous project', project: projectNavItems[previousIndex] },
      { label: 'Next project', project: projectNavItems[nextIndex] },
    ].filter((item) => item.project?.slug && item.project.slug !== project.slug);
  }, [project, projectNavItems]);

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

  useEffect(() => {
    if (hasResolved && project?.slug && slug && project.slug !== slug) {
      navigate(`/project/${encodeURIComponent(project.slug)}`, { replace: true, state: location.state });
    }
  }, [hasResolved, location.state, navigate, project?.slug, slug]);

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

        <HeroGrid>
          <Hero>
            <Eyebrow>Selected project / Yu Xuan</Eyebrow>
            <Title as={overlay ? 'h2' : 'h1'}>{project.title}</Title>
            {Array.isArray(project.tags) && project.tags.length > 0 ? (
              <TagRow>
                {project.tags.map((tag) => (
                  <Tag key={tag}>{formatWorkLabel(tag)}</Tag>
                ))}
              </TagRow>
            ) : null}
          </Hero>

          {project.mainImage ? (
            <MainImage>
              <SanityImage image={presentation.image} rect={presentation.rect} alt={project.title} eager sizes="(max-width: 767px) 100vw, 90vw" />
            </MainImage>
          ) : null}
        </HeroGrid>

        <ContentGrid>
          <DescriptionPanel>
            <BlockLabel>01 / Overview</BlockLabel>
            <DescriptionBody>
              {project.description ? <Description>{project.description}</Description> : null}

            {Array.isArray(project.arsenal) && project.arsenal.length > 0 ? (
              <>
                <SectionTitle as={overlay ? 'h3' : 'h2'}>Tools &amp; technology</SectionTitle>
                <ToolList>
                  {project.arsenal.map((tool) => (
                    <Tool key={tool.name}>{formatWorkLabel(tool.name)}</Tool>
                  ))}
                </ToolList>
              </>
            ) : null}
            </DescriptionBody>
          </DescriptionPanel>

          {Array.isArray(project.videoEmbeds) && project.videoEmbeds.length > 0 && <MediaPanel>
            <BlockLabel>In motion</BlockLabel>
              <VideoStack>
                {project.videoEmbeds.map((video, index) => (
                  <VideoEmbed key={`${project._id}-video-${index}`} embedCode={video.embedCode} />
                ))}
              </VideoStack>
          </MediaPanel>}
        </ContentGrid>

        {Array.isArray(project.additionalImages) && project.additionalImages.length > 0 ? (
          <GalleryPanel>
            <BlockLabel>02 / A closer look</BlockLabel>
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

        {adjacentProjects.length > 0 ? (
          <ProjectPager aria-label="Project navigation">
            {adjacentProjects.map(({ label, project: adjacentProject }) => (
              <ProjectPagerLink
                key={`${label}-${adjacentProject.slug}`}
                to={`/project/${encodeURIComponent(adjacentProject.slug)}`}
                replace={overlay && hasBackgroundLocation}
                state={projectLinkState}
                onClick={() => trackProjectOpen(adjacentProject, 'project_nav', {
                  direction: label.startsWith('Previous') ? 'previous' : 'next',
                })}
              >
                {adjacentProject.mainImage ? (
                  <ProjectPagerImage>
                    <img
                      src={urlFor(adjacentProject.mainImage).auto('format').width(520).height(320).fit('crop').quality(82).url()}
                      alt=""
                      loading="lazy"
                    />
                  </ProjectPagerImage>
                ) : null}
                <ProjectPagerCopy>
                  <ProjectPagerLabel>{label}</ProjectPagerLabel>
                  <ProjectPagerTitle>{adjacentProject.title}</ProjectPagerTitle>
                </ProjectPagerCopy>
              </ProjectPagerLink>
            ))}
          </ProjectPager>
        ) : null}
      </Page>
    ),
  });
}

function renderProjectShell({ overlay, onClose, children }) {
  if (!overlay) return children;
  return <ProjectOverlay onClose={onClose}>{children}</ProjectOverlay>;
}

function ProjectOverlay({ onClose, children }) {
  const location = useLocation();
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    const trigger = document.activeElement;
    const shell = document.querySelector('[data-site-shell]');
    const wasInert = shell?.hasAttribute('inert');
    shell?.setAttribute('inert', '');
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      const elements = [...(dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])') || [])]
        .filter((element) => element.getClientRects().length > 0);
      const first = elements[0], last = elements[elements.length - 1];
      if (!first) return;
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      if (!wasInert) shell?.removeAttribute('inert');
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    // Keep one dialog session while each selected project starts at its opening.
    backdropRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    dialogRef.current?.querySelector('button')?.focus({ preventScroll: true });
  }, [location.key]);

  return (
    <OverlayBackdrop ref={backdropRef} onClick={onClose} role="presentation">
      <OverlayDialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Project details"
        onClick={(event) => event.stopPropagation()}
      >
        <OverlayToolbar><OverlayIdentity to="/#home" replace aria-label="yxperiments home">yxperiments <span>/ Project</span></OverlayIdentity>
          <OverlayClose type="button" onClick={onClose} aria-label="Close project">
            <span>Close</span><FaTimes size={14} />
          </OverlayClose>
        </OverlayToolbar>
        <OverlayScroll>{children}</OverlayScroll>
      </OverlayDialog>
    </OverlayBackdrop>
  );
}

const Page = styled.div`
  width: min(1312px, calc(100% - var(--site-gutter) * 2));
  margin: 0 auto;
  padding: ${({ $overlay }) => $overlay ? 'clamp(36px, 5vw, 72px) 0 64px' : 'calc(var(--site-header-height) + 48px) 0 64px'};
  display: grid;
  gap: clamp(48px, 6vw, 88px);
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text-primary);
  h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
  > [role='status'] { background: transparent; border: 0; border-radius: 0; box-shadow: none; }
`;

const OverlayBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 220;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  background: var(--bg-base);
`;

const OverlayDialog = styled.div`
  position: relative;
  width: 100%;
  min-height: 100%;
  background: var(--bg-base);
`;

const OverlayToolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  min-height: 68px;
  padding: 10px var(--site-gutter);
  background: var(--bg-base);
  border-bottom: 1px solid var(--border-strong);
`;

const OverlayIdentity = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--text-primary);
  text-decoration: none;
  &:hover { color: var(--accent); }
  font: 600 18px/1.4 'Space Grotesk', sans-serif;
  letter-spacing: -.04em;
  span { margin-left: 16px; font: 12px/1.5 'Roboto Mono', monospace; color: var(--text-muted); letter-spacing: .05em; text-transform: uppercase; }
  ${MEDIA.phone} { span { display: none; } }
`;

const OverlayScroll = styled.div`width: 100%;`;

const OverlayClose = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-width: 100px;
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid var(--border-strong);
  border-radius: 0;
  background: transparent;
  color: var(--accent);
  font: 14px/1.4 'Space Grotesk', sans-serif;
  cursor: pointer;
  transition: background .2s, color .2s, border-color .2s;
  &:hover { background: var(--accent); border-color: var(--accent); color: var(--bg-base); }
`;

const BackLink = styled(Link)`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  border-bottom: 1px solid var(--border-strong);
  color: var(--accent);
  text-decoration: none;
  font-size: 14px;
  &:hover { border-color: var(--accent); }
`;

const HeroGrid = styled.div`display: grid; gap: clamp(32px, 4vw, 56px); min-width: 0;`;
const Hero = styled.header`display: grid; gap: 24px; min-width: 0;`;
const Eyebrow = styled.p`
  color: var(--accent);
  font: 12px/1.6 'Roboto Mono', monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
`;
const Title = styled.h1`
  max-width: 20ch;
  font-size: clamp(42px, 7.2vw, 108px);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -.055em;
  overflow-wrap: anywhere;
  color: var(--text-primary);
  ${MEDIA.phone} { font-size: clamp(36px, 9.5vw, 60px); }
`;
const TagRow = styled.div`display: flex; flex-wrap: wrap; gap: 8px 0;`;
const Tag = styled.span`
  color: var(--text-secondary);
  font: 12px/1.6 'Roboto Mono', monospace;
  letter-spacing: .03em;
  text-transform: uppercase;
  &:not(:last-child)::after { content: '/'; display: inline-block; color: var(--accent); margin: 0 16px; }
`;
const MainImage = styled.div`
  min-width: 0;
  background: var(--bg-base);
  img { display: block; width: 100%; height: auto; max-height: min(75vh, 740px); object-fit: contain; }
`;
const ContentGrid = styled.div`display: grid; gap: clamp(48px, 6vw, 80px); min-width: 0;`;
const DescriptionPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(150px, .45fr) minmax(0, 1fr);
  gap: 40px;
  padding-top: 28px;
  border-top: 1px solid var(--border-strong);
  ${MEDIA.tabletDown} { grid-template-columns: 1fr; gap: 24px; }
`;
const DescriptionBody = styled.div`min-width: 0; max-width: 78ch;`;
const MediaPanel = styled.section`display: grid; gap: 24px; min-width: 0;`;
const BlockLabel = styled.p`
  color: var(--text-muted);
  font: 12px/1.6 'Roboto Mono', monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
`;
const SectionTitle = styled.h2`
  margin: 40px 0 18px;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -.035em;
  line-height: 1.2;
`;
const Description = styled.p`
  color: var(--text-secondary);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.85;
`;
const ToolList = styled.div`display: flex; flex-wrap: wrap; gap: 10px 24px;`;
const Tool = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  color: var(--text-secondary);
  font: 14px/1.6 'Roboto Mono', monospace;
`;
const VideoStack = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
  > :first-child { grid-column: 1 / -1; }
  ${MEDIA.phone} { grid-template-columns: 1fr; gap: 24px; }
`;
const VideoContainer = styled.div`width: 100%; min-width: 0;`;
const VideoWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #050607;
  iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
`;
const InvalidVideoEmbed = styled.div`
  min-height: 100px;
  display: grid;
  place-items: center;
  border-block: 1px solid var(--border);
  color: var(--text-secondary);
  text-align: center;
  padding: 24px;
`;
const GalleryPanel = styled.section`
  min-width: 0;
  display: grid;
  gap: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--border-strong);
`;
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 40px);
  align-items: start;
  > :only-child { grid-column: 1 / -1; width: min(800px, 100%); }
  ${MEDIA.phone} { grid-template-columns: 1fr; }
`;
const GalleryItem = styled.div`
  overflow: hidden;
  min-width: 0;
  img { width: 100%; height: auto; display: block; }
`;
const ProjectPager = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(24px, 5vw, 72px);
  border-top: 1px solid var(--border-strong);
  ${MEDIA.phone} { grid-template-columns: 1fr; gap: 0; }
`;
const ProjectPagerLink = styled(Link)`
  min-width: 0;
  min-height: 152px;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 0;
  color: inherit;
  text-decoration: none;
  &:hover { color: var(--accent); }
  ${MEDIA.phone} { min-height: 124px; gap: 18px; border-bottom: 1px solid var(--border); }
`;
const ProjectPagerImage = styled.span`
  display: block;
  flex: 0 0 112px;
  height: 80px;
  overflow: hidden;
  background: var(--surface);
  img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform .3s ease; }
  ${ProjectPagerLink}:hover & img { transform: scale(1.05); }
  ${MEDIA.phone} { flex-basis: 80px; height: 60px; }
`;
const ProjectPagerCopy = styled.span`min-width: 0; display: grid; gap: 12px;`;
const ProjectPagerLabel = styled.span`
  color: var(--accent);
  font: 12px/1.6 'Roboto Mono', monospace;
  letter-spacing: .06em;
  text-transform: uppercase;
`;
const ProjectPagerTitle = styled.span`
  font-size: clamp(20px, 2.4vw, 32px);
  font-weight: 400;
  letter-spacing: -.04em;
  line-height: 1.15;
  overflow-wrap: anywhere;
`;
const ErrorCard = styled.div`
  padding: 28px 0;
  border-block: 1px solid var(--border-strong);
  color: #ffb2a6;
`;
const EmptyCard = styled.div`
  min-height: 180px;
  display: grid;
  place-items: center;
  color: var(--text-secondary);
`;
