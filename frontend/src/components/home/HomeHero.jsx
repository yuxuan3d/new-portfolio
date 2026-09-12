import React from 'react';
import styled from 'styled-components';
import ProjectGallery from './ProjectGallery';

export default function HomeHero(props) {
  return <Hero id="home">
    <Intro><h1>Yu Xuan <span>/</span> 3D · Motion · Interactive</h1><p>Ideas. Experiments. Shared experiences.</p></Intro>
    <ProjectGallery {...props} />
  </Hero>;
}
const Hero = styled.section`
  padding-top: var(--site-header-height); overflow-x: clip; position: relative;
`;
const Intro = styled.div`
  padding: 24px var(--site-gutter) 20px; display: flex; justify-content: space-between; gap: 16px;
  h1, p { font: 12px/1.5 'Roboto Mono', monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--text-secondary); }
  h1 span { padding: 0 12px; color: var(--accent); } p { color: var(--text-muted); }
  @media(max-width: 767px) { padding: 20px 20px 24px; h1 { font-size: 10px; letter-spacing: .03em; } h1 span { padding: 0 4px; } p { display: none; } }
`;
