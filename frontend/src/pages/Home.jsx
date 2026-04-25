import React, { useMemo } from 'react';
import styled from 'styled-components';
import ContactSection from '../components/ContactSection';
import ScrollReveal from '../components/ScrollReveal';
import HomeHero from '../components/home/HomeHero';
import ResumeSection from '../components/home/ResumeSection';
import WorksSection from '../components/home/WorksSection';
import { useSanityData } from '../hooks/useSanityData';

const PROJECTS_QUERY = `*[_type == "portfolioItem"] | order(orderRank) {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  tags,
  featured
}`;

export default function Home({ onHeroReady }) {
  const [projectItems, projectError, { isValidating: projectsLoading }] = useSanityData(PROJECTS_QUERY);

  const projects = useMemo(() => (Array.isArray(projectItems) ? projectItems : []), [projectItems]);

  return (
    <Page>
      <HomeHero projects={projects} onParticleEarthReady={onHeroReady} />
      <ContentBand>
        <ScrollReveal delay={40}>
          <ResumeSection />
        </ScrollReveal>
        <ScrollReveal delay={70}>
          <WorksSection projects={projects} error={projectError} isLoading={projectsLoading && !projectItems} />
        </ScrollReveal>
        <ScrollReveal delay={70}>
          <ContactSection id="contact" />
        </ScrollReveal>
      </ContentBand>
    </Page>
  );
}

const Page = styled.div`
  display: grid;
  gap: 0;
`;

const ContentBand = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding:
    var(--section-gap)
    0
    clamp(2rem, 5vw, 4rem);
  display: grid;
  gap: var(--section-gap);
  background: linear-gradient(
    180deg,
    #050608 0%,
    #0a0b0d 12%,
    ${({ theme }) => theme.surfaceAlt} 100%
  );

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1.25px);
    background-size: 26px 26px;
    background-position: center top;
    -webkit-mask-image: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.22) 3%,
      rgba(0, 0, 0, 0.58) 7%,
      rgba(0, 0, 0, 0.88) 11%,
      #000 15%,
      #000 86%,
      rgba(0, 0, 0, 0.82) 91%,
      rgba(0, 0, 0, 0.42) 96%,
      transparent 100%
    );
    mask-image: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.22) 3%,
      rgba(0, 0, 0, 0.58) 7%,
      rgba(0, 0, 0, 0.88) 11%,
      #000 15%,
      #000 86%,
      rgba(0, 0, 0, 0.82) 91%,
      rgba(0, 0, 0, 0.42) 96%,
      transparent 100%
    );
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;
