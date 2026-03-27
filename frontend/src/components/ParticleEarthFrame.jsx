import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { BREAKPOINTS, MEDIA } from '../styles/breakpoints';

export default function ParticleEarthFrame() {
  const [isPhoneViewport, setIsPhoneViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= BREAKPOINTS.phone : false,
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

  return (
    <FrameShell aria-hidden="true">
      <Frame
        src={frameSrc}
        title="Interactive particle earth"
        loading="eager"
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
