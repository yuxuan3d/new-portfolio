import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AWARD_HIGHLIGHTS } from '../../content/siteContent';
import { HERO_PROJECTS, heroPresentation, projectPath } from '../../lib/heroProjects';
import { trackProjectOpen } from '../../lib/siteEvents';
import { SanityImage } from './ProjectMedia';

export default function AwardsSection({ projects }) {
  const location = useLocation();
  const project = projects.find((item) => item._id === HERO_PROJECTS[0].id);
  const awards = AWARD_HIGHLIGHTS[0];
  return <Section id="awards" aria-labelledby="recognition-heading">
    <Label>01 / Recognition</Label>
    <Heading><h2 id="recognition-heading">Recognition</h2><span aria-hidden="true" /></Heading>
    <AwardFeature aria-labelledby="award-project-title">
      <Project>
        {project && <ProjectImage><SanityImage image={heroPresentation(project).image} sizes="(max-width: 767px) 90vw, 45vw" alt="SIT Open House 2026 interactive campus" /></ProjectImage>}
        <ProjectCopy>
          <Label>Award-winning project</Label>
          <h3 id="award-project-title">{project ? <Link to={projectPath(project)} state={{ backgroundLocation: location }} onClick={() => trackProjectOpen(project, 'awards')}>{awards.project} <span aria-hidden="true">↗</span></Link> : awards.project}</h3>
          <p>Created in collaboration with Hei and Singapore Institute of Technology.</p>
        </ProjectCopy>
      </Project>
      <AwardList aria-label={`Awards for ${awards.project}`}>
        <li><AwardSource><span aria-hidden="true">✳</span> CSS Design Awards</AwardSource><h4>Website of the Day</h4>
          <Categories><span>Best Innovation</span><span>Best UI Design</span><span>Best UX Design</span></Categories></li>
        <li><AwardSource><span aria-hidden="true">✳</span> The FWA</AwardSource><h4>FWA of the Day</h4></li>
      </AwardList>
    </AwardFeature>
  </Section>;
}
const Section = styled.section`
  width: min(var(--site-max-width), calc(100% - var(--site-gutter) * 2)); margin: 32px auto 0;
  position: relative;
  @media(max-width: 767px) { margin-top: 40px; }
`;
const Heading = styled.div`
  display: flex; align-items: center; gap: 28px;
  margin-bottom: 28px;
  h2 { font: 600 clamp(32px, 3vw, 44px)/1 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  > span { flex: 1; height: 1px; background: #ffffff28; }
`;
const Label = styled.p`font: 10px/1.5 'Roboto Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 18px;`;
const AwardFeature = styled.article`
  display: grid; grid-template-columns: 1.15fr 1fr; border-block: 1px solid var(--border-strong);
  background: linear-gradient(120deg, #35201940, #100e0d88);
  @media(max-width: 767px) { grid-template-columns: 1fr; }
`;
const Project = styled.div`position: relative; min-height: 370px; overflow: hidden; display: flex; align-items: end;`;
const ProjectImage = styled.div`
  position: absolute; inset: 0;
  img { width: 100%; height: 100%; display: block; object-fit: cover; }
  &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(transparent, #100e0dcc 55%, #100e0dfa); }
`;
const ProjectCopy = styled.div`
  position: relative; padding: 32px; width: 100%;
  > p:first-child { color: var(--accent); font-size: 12px; margin-bottom: 14px; }
  h3 { font: 600 clamp(36px, 4vw, 56px)/1 'Barlow Condensed', sans-serif; max-width: 15ch; }
  a { color: var(--text-primary); text-decoration: none; } a:hover { color: var(--accent); } h3 span { color: var(--accent); }
  > p:last-child { font-size: 14px; line-height: 1.8; color: var(--text-primary); margin-top: 16px; max-width: 40ch; }
  @media(max-width: 767px) { padding: 24px; }
`;
const AwardList = styled.ul`
  list-style: none; padding: 12px 36px; display: grid; align-content: center;
  li { padding: 28px 0; } li + li { border-top: 1px solid var(--border-strong); }
  h4 { font: 500 clamp(24px, 2.5vw, 34px)/1.2 'Barlow Condensed', sans-serif; margin-top: 16px; }
  @media(max-width: 767px) { padding: 0 24px; }
`;
const AwardSource = styled.p`
  display: flex; align-items: center; gap: 12px; color: var(--accent); font-size: 14px; font-weight: 500;
  > span { font-size: 32px; line-height: 1; }
`;
const Categories = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px; color: var(--text-primary); margin-top: 18px; font-size: 12px; line-height: 1.6;
  span { border: 1px solid #ff996640; padding: 5px 9px; }
`;
