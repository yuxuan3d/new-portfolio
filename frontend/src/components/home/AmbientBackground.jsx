import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

export default function AmbientBackground({ overlayOpen }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const update = () => setPaused(document.hidden || Boolean(navigator.connection?.saveData));
    update();
    document.addEventListener('visibilitychange', update);
    navigator.connection?.addEventListener?.('change', update);
    return () => {
      document.removeEventListener('visibilitychange', update);
      navigator.connection?.removeEventListener?.('change', update);
    };
  }, []);
  return <Backdrop aria-hidden="true" data-ambient-background $paused={paused || overlayOpen} />;
}

const flow = keyframes`
  from { transform: translate3d(-3%, -3%, 0); }
  to { transform: translate3d(3%, 3%, 0); }
`;
const Backdrop = styled.div`
  position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; contain: strict;
  background: radial-gradient(ellipse at 10% 85%, #71391f30, transparent 55%);
  &::before {
    content: ''; position: absolute; inset: -4%; will-change: transform;
    background: radial-gradient(ellipse 55% 40% at 85% 20%, #ab512960, transparent 100%),
      radial-gradient(ellipse 45% 60% at 5% 70%, #71609445, transparent 100%);
    animation: ${flow} 28s ease-in-out infinite alternate;
    animation-play-state: ${({ $paused }) => $paused ? 'paused' : 'running'};
  }
  &::after {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(#ffb0880c 1px, transparent 1px), linear-gradient(90deg, #ffb0880c 1px, transparent 1px);
    background-size: 96px 96px;
  }
  @media(prefers-reduced-motion: reduce) { &::before { animation: none; will-change: auto; } }
`;
