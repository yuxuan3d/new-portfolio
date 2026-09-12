import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { trackProjectOpen } from '../../lib/siteEvents';
import { urlFor } from '../../lib/sanityClient';
import { getProjectDisciplines, WORK_DISCIPLINES } from '../../lib/workDisciplines';
import { heroPresentation, HERO_PROJECTS, imageDimensions, imageReference, projectPath, selectHeroProjects } from '../../lib/heroProjects';
import { SanityImage } from './ProjectMedia';

function WorkImage({ project }) {
  const [failed, setFailed] = useState(false);
  const landscape = project.additionalImages?.find((image) => imageReference(image) === 'image-4fb270893e389aa1e813ae10cde973bedc891a84-3840x2160-png');
  const image = landscape || project.mainImage;
  const rect = heroPresentation(project).rect;
  const dimensions = imageDimensions(image);
  let src = '';
  if (dimensions) {
    const source = { ...image, asset: { _ref: imageReference(image) } };
    if (rect) { delete source.crop; delete source.hotspot; }
    let builder = urlFor(source).auto('format').width(Math.min(1000, dimensions.width)).quality(80);
    if (rect) builder = builder.rect(...rect);
    src = builder.url();
  }
  return <Media>
    {src && !failed ? <img src={src} width={dimensions.width} height={dimensions.height} loading="lazy" decoding="async" alt={project.title} onError={() => setFailed(true)} /> : <span>Preview unavailable</span>}
  </Media>;
}

export default function WorksSection({ projects, error, isLoading, onRetry }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [activeTag, setActiveTag] = useState('all');
  const selected = useMemo(() => {
    const items = selectHeroProjects(projects);
    const jpm = items.find((p) => p._id === HERO_PROJECTS[1].id);
    return jpm ? [jpm, ...items.filter((p) => p !== jpm)] : items;
  }, [projects]);
  const ordered = useMemo(() => [...selected, ...projects.filter((p) => p.slug && !selected.some((s) => s._id === p._id))], [projects, selected]);
  const items = (expanded ? ordered : selected).filter((project) => activeTag === 'all' || getProjectDisciplines(project).includes(activeTag));
  const processProject = !expanded && selected.find((project) => heroPresentation(project).companion);
  const processMedia = processProject ? heroPresentation(processProject) : null;
  return <Section id="works">
    <Label>02 / Selected work</Label>
    <Heading><h2>{expanded ? 'All projects' : 'Selected projects'}<span aria-hidden="true">↗</span></h2></Heading>
    {error && <Error role="alert">{error} <button type="button" onClick={onRetry}>Try again</button></Error>}
    {expanded && <Filters aria-label="Filter projects by discipline">
      {WORK_DISCIPLINES.map((discipline) => <Filter key={discipline.id} type="button" aria-pressed={activeTag === discipline.id}
        aria-controls="work-project-grid" onClick={() => setActiveTag(discipline.id)}>{discipline.label}</Filter>)}
    </Filters>}
    <Status aria-live="polite">{items.length} {items.length === 1 ? 'project' : 'projects'} shown{expanded ? ` for ${WORK_DISCIPLINES.find((d) => d.id === activeTag)?.label}.` : '.'}</Status>
    {isLoading ? <Error role="status">Loading projects…</Error> :
      <Grid id="work-project-grid" aria-label="Projects" $expanded={expanded}>
        {items.filter((project) => project !== processProject).map((project, i) => <Card key={project._id}>
          <Link to={projectPath(project)} state={{ backgroundLocation: location }} onClick={() => trackProjectOpen(project, 'works_grid', { position: i + 1, active_tag: activeTag })}>
            <WorkImage project={project} />
            <Caption><h3>{project.title}</h3><span aria-hidden="true">↗</span></Caption>
            <Role>{heroPresentation(project).role === 'Selected portfolio work'
              ? getProjectDisciplines(project).map((id) => WORK_DISCIPLINES.find((d) => d.id === id)?.label).filter(Boolean).join(' · ')
              : heroPresentation(project).role}</Role>
            {!expanded && heroPresentation(project).summary && <Contribution>{heroPresentation(project).summary}</Contribution>}
          </Link>
        </Card>)}
      </Grid>}
    {processProject && <ProcessFeature aria-label="Cinder field note">
      <ProcessImages>
        <figure><SanityImage image={processMedia.image} sizes="(max-width: 767px) 42vw, 300px" maxWidth={350} alt="Cinder virtual character" /><figcaption>Character</figcaption></figure>
        <figure><SanityImage image={processMedia.companion} sizes="(max-width: 767px) 42vw, 300px" maxWidth={500} alt="Cinder motion-capture setup, with the original face blur" /><figcaption>Capture setup</figcaption></figure>
      </ProcessImages>
      <div><Label>Field note / Cinder</Label><h3>From performance<br />to character.</h3>
        <Role>Leading a team to bring full-body and facial motion capture into a real-time virtual character.</Role>
        <ProcessLink to={projectPath(processProject)} state={{ backgroundLocation: location }} onClick={() => trackProjectOpen(processProject, 'works_process')}>Explore Cinder ↗</ProcessLink>
      </div>
    </ProcessFeature>}
    {!isLoading && !items.length && !error && <Error>No projects found{activeTag !== 'all' ? ' for this discipline' : ''}.</Error>}
    {ordered.length > selected.length && <Expand type="button" aria-expanded={expanded} aria-controls="work-project-grid"
      onClick={() => { setExpanded((value) => !value); setActiveTag('all'); }}>
      {expanded ? 'Show selected work' : `Explore all ${ordered.length} projects`} <span aria-hidden="true">{expanded ? '−' : '+'}</span>
    </Expand>}
  </Section>;
}
const Section = styled.section`
  width: min(var(--site-max-width), calc(100% - var(--site-gutter) * 2)); margin: 0 auto;
`;
const Heading = styled.div`
  display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 32px;
  h2 { width: 100%; display: flex; justify-content: space-between; gap: 20px; font: 600 clamp(48px, 6.5vw, 88px)/1 'Barlow Condensed', sans-serif; letter-spacing: -.025em; }
  h2 span { color: var(--accent); font-weight: 400; }
  p { color: var(--text-secondary); font-size: 14px; }
  @media(max-width: 767px) { display: grid; gap: 12px; }
`;
const Label = styled.p`font: 10px/1.5 'Roboto Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 18px;`;
const Grid = styled.div`
  display: grid; grid-template-columns: ${({ $expanded }) => $expanded ? 'repeat(2, minmax(0, 1fr))' : '1.55fr 1fr'}; gap: 32px 32px; align-items: start;
  > article:nth-child(2) { margin-top: ${({ $expanded }) => $expanded ? '0' : '64px'}; }
  @media(max-width: 900px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media(max-width: 767px) { grid-template-columns: 1fr; > article:nth-child(2) { margin-top: 0; } }
`;
const Card = styled.article`
  min-width: 0; a { color: inherit; text-decoration: none; display: block; }
  a:hover h3 { color: var(--accent); }
`;
const Media = styled.div`
  aspect-ratio: 1.65; border-radius: 4px; overflow: hidden; background: var(--surface); display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; transition: transform 700ms cubic-bezier(.22, 1, .36, 1); }
  a:hover & img { transform: scale(1.035); }
  @media(prefers-reduced-motion: reduce) { img { transition: none; } }
  > span { color: var(--text-secondary); font-size: 14px; }
`;
const Caption = styled.div`
  display: flex; justify-content: space-between; gap: 12px; margin-top: 20px;
  h3 { font: 600 clamp(28px, 2.8vw, 40px)/1.1 'Barlow Condensed', sans-serif; } > span { color: var(--accent); }
`;
const Role = styled.p`color: var(--text-secondary); font-size: 14px; line-height: 1.7; margin-top: 8px;`;
const Filters = styled.div`display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;`;
const Filter = styled.button`
  min-height: 44px; padding: 8px 16px; border-radius: 24px; border: 1px solid var(--border-strong);
  background: var(--surface); color: var(--text-secondary); font-size: 14px; cursor: pointer;
  &[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); }
`;
const Expand = styled(Filter)`display: flex; align-items: center; gap: 24px; margin: 32px auto 0;`;
const Error = styled.div`
  padding: 24px; color: var(--text-secondary); border: 1px solid #ffffff25; border-radius: 12px;
  button { min-height: 44px; padding: 8px 16px; margin-left: 16px; cursor: pointer; }
`;
const Status = styled.p`position: absolute; width: 1px; height: 1px; clip-path: inset(50%); overflow: hidden;`;
const Contribution = styled.p`color: var(--text-primary); font-size: 16px; line-height: 1.7; margin-top: 12px; max-width: 45ch;`;
const ProcessFeature = styled.article`
  display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: center;
  padding: 40px 0; margin-top: 48px; border-block: 1px solid var(--border-strong);
  h3 { font: 600 clamp(36px, 4vw, 56px)/1 'Barlow Condensed', sans-serif; }
  @media(max-width: 767px) { grid-template-columns: 1fr; gap: 28px; }
`;
const ProcessImages = styled.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;
  figure { min-width: 0; }
  img { display: block; width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; border-radius: 4px; }
  figcaption { font: 12px/1.5 'Roboto Mono', monospace; color: var(--text-secondary); margin-top: 12px; }
`;
const ProcessLink = styled(Link)`display: inline-flex; align-items: center; min-height: 44px; margin-top: 16px; color: var(--accent); text-underline-offset: 6px; font-size: 14px;`;
