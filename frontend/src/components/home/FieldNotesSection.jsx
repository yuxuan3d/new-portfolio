import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { projectPath } from '../../lib/heroProjects';
import { trackProjectOpen } from '../../lib/siteEvents';
import { SanityImage } from './ProjectMedia';

export default function FieldNotesSection({ projects, posts, error, isLoading, onRetry }) {
  const location = useLocation();
  const note = Array.isArray(posts) ? posts.find((post) => post.slug && post.title) : null;
  const study = projects.find((project) => project._id === 'e66165bf-e44e-489e-b0f3-bda746df25e0' && project.slug);
  return <Section id="field-notes" aria-labelledby="field-notes-heading">
    <Label>03 / Field notes</Label>
    <Heading><h2 id="field-notes-heading">A little further down<br />the rabbit hole.</h2><Link to="/rnd">R&amp;D index ↗</Link></Heading>
    <Grid>
      {note && <Entry to={`/rnd/${encodeURIComponent(note.slug)}`}>
        <Media><SanityImage image={note.mainImage} sizes="(max-width: 767px) 90vw, 55vw" alt={note.title} maxWidth={1000} /></Media>
        <Label>Procedural design / Breakdown</Label><h3>{note.title} <span aria-hidden="true">↗</span></h3><p>{note.excerpt}</p>
      </Entry>}
      {study && <Entry to={projectPath(study)} state={{ backgroundLocation: location }} onClick={() => trackProjectOpen(study, 'field_notes')}>
        <Media><SanityImage image={study.mainImage} sizes="(max-width: 767px) 90vw, 40vw" alt={study.title} maxWidth={1000} /></Media>
        <Label>Simulation / Study</Label><h3>{study.title} <span aria-hidden="true">↗</span></h3><p>Exploring particle flow and texture through a Houdini sand simulation.</p>
      </Entry>}
    </Grid>
    {isLoading && <Status role="status">Loading field notes…</Status>}
    {error && <Status role="status">The latest note could not be loaded. <button type="button" onClick={onRetry}>Try again</button></Status>}
    {!note && !study && !isLoading && !error && <Status>Explore the <Link to="/rnd">R&amp;D index</Link> for experiments and notes.</Status>}
  </Section>;
}
const Section = styled.section`width: min(var(--site-max-width), calc(100% - var(--site-gutter) * 2)); margin: 0 auto;`;
const Label = styled.p`font: 12px/1.5 'Roboto Mono', monospace; color: var(--text-secondary); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 16px;`;
const Heading = styled.div`
  display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 32px;
  h2 { font: 600 clamp(44px, 5.5vw, 76px)/1 'Barlow Condensed', sans-serif; }
  a { min-height: 44px; display: inline-flex; align-items: center; color: var(--accent); text-underline-offset: 6px; font-size: 14px; }
  @media(max-width: 767px) { display: block; a { margin-top: 16px; } }
`;
const Grid = styled.div`display: grid; grid-template-columns: 1.45fr 1fr; gap: 32px; @media(max-width: 767px) { grid-template-columns: 1fr; }`;
const Entry = styled(Link)`
  display: block; color: inherit; text-decoration: none; min-width: 0;
  h3 { display: flex; justify-content: space-between; gap: 12px; font: 600 32px/1.15 'Barlow Condensed', sans-serif; margin-bottom: 12px; }
  h3 span { color: var(--accent); } &:hover h3 { color: var(--accent); }
  > p:last-child { color: var(--text-secondary); font-size: 16px; line-height: 1.7; max-width: 48ch; }
`;
const Media = styled.div`
  aspect-ratio: 16 / 10; background: var(--surface); border-radius: 4px; overflow: hidden; margin-bottom: 24px;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`;
const Status = styled.div`color: var(--text-secondary); margin-top: 20px; button { min-height: 44px; padding: 8px 16px; margin-left: 12px; background: var(--surface); color: var(--accent); border: 1px solid var(--border-strong); cursor: pointer; }`;
