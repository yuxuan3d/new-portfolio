import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BREAKPOINTS, MEDIA } from '../styles/breakpoints';

const MESSAGE_TYPES = {
  thumbnails: 'particle-earth:project-thumbnails',
  openProject: 'particle-earth:open-project',
};

export default function ParticleEarthFrame({ projects = [], onReady }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPhoneViewport, setIsPhoneViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= BREAKPOINTS.phone : false,
  );
  const frameRef = useRef(null);
  const hasReportedReadyRef = useRef(false);

  const projectThumbnails = useMemo(
    () =>
      projects.flatMap((project) => {
        if (!project?.slug) {
          return [];
        }

        return [
          {
            slug: project.slug,
            title: project.title || project.slug,
          },
        ];
      }),
    [projects],
  );

  const knownProjectSlugs = useMemo(
    () => new Set(projectThumbnails.map((project) => project.slug)),
    [projectThumbnails],
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.phone}px)`);
    const update = (event) => setIsPhoneViewport(event.matches);

    setIsPhoneViewport(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  const frameSrc = useMemo(
    () => `/particle-earth/index.html?embed=1${isPhoneViewport ? '&mobile=1' : ''}`,
    [isPhoneViewport],
  );

  useEffect(() => {
    hasReportedReadyRef.current = false;
  }, [frameSrc]);

  const postProjectThumbnails = useCallback(() => {
    const targetWindow = frameRef.current?.contentWindow;
    if (!targetWindow || typeof window === 'undefined') {
      return;
    }

    targetWindow.postMessage(
      {
        type: MESSAGE_TYPES.thumbnails,
        projects: projectThumbnails,
      },
      window.location.origin,
    );
  }, [projectThumbnails]);

  useEffect(() => {
    if (!hasReportedReadyRef.current) {
      return;
    }

    postProjectThumbnails();
  }, [postProjectThumbnails]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data;
      if (data?.type !== MESSAGE_TYPES.openProject || typeof data.slug !== 'string') {
        return;
      }

      if (!knownProjectSlugs.has(data.slug)) {
        return;
      }

      navigate(`/project/${data.slug}`, {
        state: { backgroundLocation: location },
      });
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [knownProjectSlugs, location, navigate]);

  const handleLoad = useCallback(() => {
    if (hasReportedReadyRef.current) {
      return;
    }

    hasReportedReadyRef.current = true;
    postProjectThumbnails();
    onReady?.();
  }, [onReady, postProjectThumbnails]);

  return (
    <FrameShell>
      <Frame
        ref={frameRef}
        src={frameSrc}
        title="Interactive particle earth"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin"
        onLoad={handleLoad}
      />
    </FrameShell>
  );
}

const FrameShell = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  background: #090a0c;
`;

const Frame = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  transform: scale(1.04);
  transform-origin: center;
  filter: none;

  ${MEDIA.tabletDown} {
    transform: scale(1.01);
    filter: none;
  }

  ${MEDIA.phone} {
    transform: scale(0.95);
    filter: none;
  }
`;
