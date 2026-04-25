import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { WORKS_CONTENT } from '../../content/siteContent';
import { urlFor } from '../../lib/sanityClient';
import { MEDIA } from '../../styles/breakpoints';
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

const FILTER_FADE_MS = 200;
const FLIP_TRANSITION = 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)';

function matchesActiveTag(project, activeTag) {
  if (activeTag === 'All') return true;
  return Array.isArray(project.tags) && project.tags.includes(activeTag);
}

function sameRenderedProjects(currentItems, nextItems) {
  if (currentItems.length !== nextItems.length) return false;
  return currentItems.every((project, index) => {
    const nextProject = nextItems[index];
    return project._id === nextProject?._id && project === nextProject;
  });
}

export default function WorksSection({ projects, error, isLoading }) {
  const location = useLocation();
  const [activeTag, setActiveTag] = useState('All');
  const [displayedItems, setDisplayedItems] = useState([]);
  const [exitingIds, setExitingIds] = useState([]);
  const [enteringIds, setEnteringIds] = useState([]);
  const itemRefs = useRef(new Map());
  const previousRectsRef = useRef(new Map());
  const flipIdsRef = useRef([]);
  const filterTimeoutRef = useRef(null);

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
  const filteredItems = useMemo(
    () => orderedItems.filter((project) => matchesActiveTag(project, activeTag)),
    [activeTag, orderedItems],
  );

  const setItemRef = useCallback((projectId, node) => {
    if (!node) {
      itemRefs.current.delete(projectId);
      return;
    }

    itemRefs.current.set(projectId, node);
  }, []);

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current !== null) {
        window.clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (displayedItems.length === 0 && filteredItems.length > 0) {
      setDisplayedItems(filteredItems);
      return;
    }

    if (filterTimeoutRef.current !== null) {
      window.clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = null;
    }

    if (sameRenderedProjects(displayedItems, filteredItems)) {
      setExitingIds([]);
      setEnteringIds([]);
      flipIdsRef.current = [];
      previousRectsRef.current = new Map();
      return;
    }

    const nextIds = new Set(filteredItems.map((project) => project._id));
    const currentIds = new Set(displayedItems.map((project) => project._id));
    const sharedIds = displayedItems
      .filter((project) => nextIds.has(project._id))
      .map((project) => project._id);
    const exiting = displayedItems
      .filter((project) => !nextIds.has(project._id))
      .map((project) => project._id);
    const entering = filteredItems
      .filter((project) => !currentIds.has(project._id))
      .map((project) => project._id);
    const firstRects = new Map();

    sharedIds.forEach((projectId) => {
      const node = itemRefs.current.get(projectId);
      if (node) {
        firstRects.set(projectId, node.getBoundingClientRect());
      }
    });

    previousRectsRef.current = firstRects;
    flipIdsRef.current = sharedIds;

    if (displayedItems.length === 0) {
      setDisplayedItems(filteredItems);
      setExitingIds([]);
      setEnteringIds([]);
      return;
    }

    if (exiting.length === 0) {
      setDisplayedItems(filteredItems);
      setExitingIds([]);
      setEnteringIds(entering);
      return;
    }

    setExitingIds(exiting);
    filterTimeoutRef.current = window.setTimeout(() => {
      setDisplayedItems(filteredItems);
      setExitingIds([]);
      setEnteringIds(entering);
      filterTimeoutRef.current = null;
    }, FILTER_FADE_MS);
  }, [displayedItems, filteredItems]);

  useEffect(() => {
    if (enteringIds.length === 0) return undefined;

    const frame = window.requestAnimationFrame(() => {
      setEnteringIds([]);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [enteringIds]);

  useLayoutEffect(() => {
    const idsToFlip = flipIdsRef.current;
    if (!idsToFlip.length) {
      return;
    }

    const cleanupFns = [];
    idsToFlip.forEach((projectId) => {
      const node = itemRefs.current.get(projectId);
      const firstRect = previousRectsRef.current.get(projectId);

      if (!node || !firstRect) {
        return;
      }

      const lastRect = node.getBoundingClientRect();
      const deltaX = firstRect.left - lastRect.left;
      const deltaY = firstRect.top - lastRect.top;

      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
        return;
      }

      node.style.transition = 'none';
      node.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      node.style.willChange = 'transform';

      const frame = window.requestAnimationFrame(() => {
        node.style.transition = FLIP_TRANSITION;
        node.style.transform = 'translate(0, 0)';
      });

      const cleanup = () => {
        window.cancelAnimationFrame(frame);
        node.style.transition = '';
        node.style.transform = '';
        node.style.willChange = '';
      };

      node.addEventListener('transitionend', cleanup, { once: true });
      cleanupFns.push(cleanup);
    });

    flipIdsRef.current = [];
    previousRectsRef.current = new Map();

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, [displayedItems]);

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
        ) : displayedItems.length > 0 ? (
          <ArchiveGrid aria-label="Projects">
            {displayedItems.map((project, index) => {
              const isFeature = index === 0;
              const isSideFeature = index === 1;

              return (
                <ArchiveItem
                  key={project._id}
                  ref={(node) => setItemRef(project._id, node)}
                  $isExiting={exitingIds.includes(project._id)}
                  $isEntering={enteringIds.includes(project._id)}
                  $feature={isFeature}
                  $sideFeature={isSideFeature}
                >
                  <ArchiveLink
                    to={`/project/${project.slug}`}
                    state={{ backgroundLocation: location }}
                    tabIndex={exitingIds.includes(project._id) ? -1 : undefined}
                    aria-hidden={exitingIds.includes(project._id)}
                  >
                    <ArchiveCard $feature={isFeature} $sideFeature={isSideFeature}>
                      <ArchiveImage>
                        <LazyImage
                          src={urlFor(project.mainImage).auto('format').width(900).height(720).fit('crop').quality(90).url()}
                          alt={project.title}
                          sizes={isFeature ? '(max-width: 720px) 100vw, (max-width: 1100px) 100vw, 66vw' : '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw'}
                        />
                      </ArchiveImage>
                      <ArchiveOverlay $feature={isFeature} $sideFeature={isSideFeature}>
                        {isFeature ? <ArchiveEyebrow>Selected project</ArchiveEyebrow> : null}
                        <ArchiveTitle $feature={isFeature} $sideFeature={isSideFeature}>{project.title}</ArchiveTitle>
                        {isFeature && Array.isArray(project.tags) && project.tags.length > 0 ? (
                          <ArchiveTagRow>
                            {project.tags.slice(0, 4).map((tag) => (
                              <ArchiveTag key={tag}>{tag}</ArchiveTag>
                            ))}
                          </ArchiveTagRow>
                        ) : null}
                      </ArchiveOverlay>
                    </ArchiveCard>
                  </ArchiveLink>
                </ArchiveItem>
              );
            })}
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
  width: min(var(--site-max-width), calc(100% - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 1.6rem) 0 0;
  display: grid;
  gap: 0.95rem;
`;

const SectionHeader = styled.header`
  display: grid;
  gap: 0.35rem;
  padding-left: var(--panel-padding);

  ${MEDIA.phone} {
    padding-left: 0;
  }
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
  padding: var(--panel-padding);
  display: grid;
  gap: clamp(1rem, 2vw, 1.35rem);
`;

const FilterRail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;

  ${MEDIA.phone} {
    flex-wrap: nowrap;
    overflow-x: auto;
    margin-inline: calc(var(--panel-padding) * -1);
    padding-inline: var(--panel-padding);
    padding-bottom: 0.15rem;
    scrollbar-width: thin;
  }
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
  flex: 0 0 auto;
`;

const ArchiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;

  ${MEDIA.tabletDown} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${MEDIA.phone} {
    grid-template-columns: 1fr;
  }
`;

const ArchiveItem = styled.div`
  min-width: 0;
  grid-column: ${({ $feature }) => ($feature ? 'span 8' : 'span 4')};
  opacity: ${({ $isExiting, $isEntering }) => {
    if ($isExiting || $isEntering) return 0;
    return 1;
  }};
  transition: opacity ${FILTER_FADE_MS}ms ease;
  pointer-events: ${({ $isExiting }) => ($isExiting ? 'none' : 'auto')};

  ${MEDIA.tabletDown} {
    grid-column: ${({ $feature }) => ($feature ? '1 / -1' : 'span 1')};
  }

  ${MEDIA.phone} {
    grid-column: 1;
  }
`;

const ArchiveLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const ArchiveCard = styled.article`
  position: relative;
  aspect-ratio: ${({ $feature, $sideFeature }) => {
    if ($feature) return '16 / 8.6';
    if ($sideFeature) return '1 / 1.1';
    return '1 / 0.78';
  }};
  overflow: hidden;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);

  ${MEDIA.tabletDown} {
    aspect-ratio: ${({ $feature }) => ($feature ? '16 / 8.6' : '1 / 0.78')};
  }

  ${MEDIA.phone} {
    aspect-ratio: 1 / 0.86;
  }
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
  padding: ${({ $feature, $sideFeature }) => ($feature || $sideFeature ? 'clamp(1.1rem, 3.3vw, 2rem)' : 'clamp(1rem, 2.8vw, 1.35rem)')};
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 0.55rem;
  background: linear-gradient(180deg, transparent 28%, rgba(0, 0, 0, 0.78) 100%);
`;

const ArchiveTitle = styled.h4`
  width: 100%;
  color: white;
  text-align: left;
  font-size: ${({ $feature, $sideFeature }) => {
    if ($feature) return 'clamp(1.35rem, 3vw, 2.35rem)';
    if ($sideFeature) return 'clamp(1.1rem, 1.6vw, 1.35rem)';
    return '0.98rem';
  }};
  line-height: ${({ $feature }) => ($feature ? 1.02 : 1.2)};
  text-shadow:
    0 2px 10px rgba(0, 0, 0, 0.85),
    0 1px 3px rgba(0, 0, 0, 0.95);
`;

const ArchiveEyebrow = styled.p`
  color: ${({ theme }) => theme.accent};
  font-family: 'Roboto Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
`;

const ArchiveTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const ArchiveTag = styled.span`
  min-height: 28px;
  padding: 0.38rem 0.58rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(5, 6, 8, 0.44);
  color: ${({ theme }) => theme.text.primary};
  font-family: 'Roboto Mono', monospace;
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
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
