import React from 'react';
import styled from 'styled-components';

export default function ParticleEarthFrame() {
  return (
    <FrameShell aria-hidden="true">
      <Frame
        src="/particle-earth/index.html?embed=1"
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
  filter: brightness(0.46) contrast(1.22) saturate(0.84);
`;
