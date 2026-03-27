import React, { useMemo } from 'react';
import styled from 'styled-components';
import ContactSection from '../components/ContactSection';
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

export default function Home() {
  const [projectItems, projectError, { isValidating: projectsLoading }] = useSanityData(PROJECTS_QUERY);

  const projects = useMemo(() => (Array.isArray(projectItems) ? projectItems : []), [projectItems]);

  return (
    <Page>
      <HomeHero />
      <ResumeSection />
      <WorksSection projects={projects} error={projectError} isLoading={projectsLoading && !projectItems} />
      <ContactSection id="contact" />
    </Page>
  );
}

const Page = styled.div`
  padding-bottom: clamp(2rem, 5vw, 4rem);
  display: grid;
  gap: var(--section-gap);
`;
