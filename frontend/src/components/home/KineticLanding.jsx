import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SanityImage } from './ProjectMedia';
import { EXTERNAL_LINKS, SOCIAL_LINKS } from '../../constants/social';
import { heroPresentation, HERO_PROJECTS, projectPath, selectHeroProjects } from '../../lib/heroProjects';
import { trackProjectOpen } from '../../lib/siteEvents';
import { getProjectDisciplines, WORK_DISCIPLINES } from '../../lib/workDisciplines';
import { AWARD_HIGHLIGHTS, CAPABILITY_CARDS } from '../../content/siteContent';
import ContactSection from '../ContactSection';
import './kinetic.css';

export function ProjectAnchor({ project, source = 'kinetic_work', children, ...props }) {
  const location = useLocation();
  return <Link {...props} to={projectPath(project)} state={{ backgroundLocation: location }}
    onClick={() => trackProjectOpen(project, source)}>{children}</Link>;
}

function StudioMark({ className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (typeof IntersectionObserver === 'undefined') { element.dataset.visible = 'true'; return; }
    const observer = new IntersectionObserver(([entry]) => { element.dataset.visible = String(entry.isIntersecting); });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className={`kinetic-studio-mark ${className}`} aria-hidden="true"><span>✳</span></span>;
}

function ParticleSeaLoop({ active }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  // Load motion only while allowed and visible. The original Sanity poster
  // stays underneath for reduced motion, data saving, errors or blocked autoplay.
  if (!active || failed) return null;
  return <video className="kinetic-hero-loop" data-ready={loaded} aria-hidden="true"
    src="/media/particle-sea-loop.mp4" width="720" height="900" autoPlay muted loop playsInline
    onLoadStart={() => setLoaded(false)} onPlaying={() => setLoaded(true)} onError={() => setFailed(true)} />;
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    // Content stays readable without JavaScript and for direct anchor navigation.
    if (element.getBoundingClientRect().top > window.innerHeight) element.dataset.entered = 'false';
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
      if (entry.isIntersecting) element.dataset.entered = 'true';
    }, { threshold: .06 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`kinetic-reveal ${className}`}>{children}</div>;
}

export default function KineticLanding({ projects, error, isLoading, onRetry, overlayOpen, children }) {
  const ref = useRef(null);
  const [heroMotionActive, setHeroMotionActive] = useState(false);
  const artwork = projects.find((project) => project.title?.trim() === 'Particle Sea') || projects[0];
  useEffect(() => {
    const element = ref.current;
    const hero = element.querySelector('.kinetic-hero');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = true;
    const update = () => {
      frame = 0;
      const allowed = !overlayOpen && !document.hidden && !media.matches && !navigator.connection?.saveData;
      element.dataset.motion = allowed ? 'on' : 'off';
      hero.dataset.running = String(allowed && visible);
      setHeroMotionActive(allowed && visible);
      const progress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      element.style.setProperty('--reading-progress', String(Math.min(1, Math.max(0, progress))));
      hero.style.setProperty('--hero-shift', allowed && visible ? `${Math.min(window.scrollY * .14, 100)}px` : '0px');
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    observer?.observe(hero);
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    media.addEventListener('change', schedule);
    navigator.connection?.addEventListener('change', schedule);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); document.removeEventListener('visibilitychange', schedule); media.removeEventListener('change', schedule); navigator.connection?.removeEventListener('change', schedule); };
  }, [overlayOpen]);
  return <div className="kinetic-page" ref={ref}>
    <div className="kinetic-progress" aria-hidden="true" />
    <section className="kinetic-hero" id="home" aria-labelledby="kinetic-title">
      <div className="kinetic-hero-top kinetic-mono"><span>Yu Xuan / Multidisciplinary artist</span><span>3D · VFX · Interactive</span></div>
      {artwork && <div className="kinetic-hero-art" data-kinetic-art>
        <SanityImage image={artwork.mainImage} eager sizes="(max-width: 700px) 100vw, 65vw" alt={`${artwork.title.trim()} — a study by Yu Xuan`} />
        {artwork.title.trim() === 'Particle Sea' && <ParticleSeaLoop active={heroMotionActive} />}
        <div className="kinetic-art-shade" />
      </div>}
      <div className="kinetic-hero-type"><h1 id="kinetic-title">BEYOND<span>THE <i>EXPECTED.</i></span></h1><StudioMark className="kinetic-hero-mark" /></div>
      <div className="kinetic-hero-bottom">
        <div><p className="kinetic-hero-intro">Imagined with curiosity.<br />Made to be experienced.</p>
          <a className="kinetic-reel" href={EXTERNAL_LINKS.DEMO_REEL} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span>Play showreel</a>
        </div>
        <div className="kinetic-hero-caption">
          <p>3D worlds, moving images &amp;<br />experiences beyond the screen.</p>
          {artwork && <ProjectAnchor project={artwork} source="kinetic_hero" className="kinetic-art-link"><span className="kinetic-mono">On display / {artwork.title.trim()}</span><span aria-hidden="true">↗</span></ProjectAnchor>}
        </div>
      </div>
      <div className="kinetic-hero-foot kinetic-mono"><Link to="/#works">Scroll to explore <span aria-hidden="true">↓</span></Link><span>An ongoing experiment.</span></div>
      {isLoading && <p role="status" className="kinetic-load">Loading selected work…</p>}
      {error && <p role="status" className="kinetic-load">Projects couldn’t load. <button type="button" onClick={onRetry}>Try again</button></p>}
    </section>
    {children}
  </div>;
}

function ProjectImage({ project, eager = false }) {
  const media = heroPresentation(project);
  return <SanityImage image={media.image} rect={media.rect} eager={eager} sizes="(max-width: 700px) 100vw, 85vw" alt={project.title.trim()} />;
}

function ProjectCard({ project, index, wide = false }) {
  const media = heroPresentation(project);
  return <Reveal className={`kinetic-project ${wide ? 'kinetic-project-wide' : ''}`}>
    <ProjectAnchor project={project} className="kinetic-project-link">
      <div className="kinetic-project-image"><ProjectImage project={project} /><span className="kinetic-open">View project <span aria-hidden="true">↗</span></span><span className="kinetic-project-number kinetic-mono">{String(index).padStart(2, '0')}</span></div>
      <div className="kinetic-project-caption"><h3>{project.title.trim()}</h3><span aria-hidden="true">↗</span></div>
      <p className="kinetic-project-role">{media.role}</p>
      {media.summary && <p className="kinetic-project-summary">{media.summary}</p>}
    </ProjectAnchor>
  </Reveal>;
}

export function KineticWork({ projects, isLoading, error, onRetry }) {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState('all');
  const selected = selectHeroProjects(projects);
  const validProjects = projects.filter((project) => project.slug && project.title);
  const archive = validProjects.filter((project) => filter === 'all' || getProjectDisciplines(project).includes(filter));
  const sit = projects.find((project) => project._id === HERO_PROJECTS[0].id && project.slug);
  return <section id="works" className="kinetic-work kinetic-wrap" aria-labelledby="kinetic-work-title">
    <Reveal><div className="kinetic-section-heading"><span className="kinetic-mono">01 / Selected work</span><span className="kinetic-mono">Ideas made tangible</span></div>
      <div className="kinetic-work-intro"><h2 id="kinetic-work-title">Different worlds.<br /><span>Same curiosity.</span></h2><p>From a single frame to a place you can explore. A selection of work across 3D, motion and interactive experiences.</p></div></Reveal>
    {isLoading && <p className="kinetic-status" role="status">Loading projects…</p>}
    {error && <p className="kinetic-status" role="alert">Projects are unavailable. <button type="button" onClick={onRetry}>Try again</button></p>}
    {!isLoading && !error && !selected.length && <p className="kinetic-status">New work will appear here when published.</p>}
    {selected[0] && <ProjectCard project={selected[0]} index={1} wide />}
    {sit && <div id="awards" className="kinetic-recognition">
      <div><span className="kinetic-mono">Recognition</span><ProjectAnchor project={sit}>{sit.title.trim()} <span aria-hidden="true">↗</span></ProjectAnchor></div>
      <div className="kinetic-awards-list">{AWARD_HIGHLIGHTS[0].awards.map((award) => <p key={award.label}><strong>{award.organization}</strong><span>{award.label}</span></p>)}</div>
    </div>}
    <div className="kinetic-project-pair">{selected.slice(1).map((project, index) => <ProjectCard key={project._id} project={project} index={index + 2} />)}</div>
    {validProjects.length > selected.length && <div className="kinetic-archive">
      <button className="kinetic-archive-toggle" type="button" aria-expanded={expanded} aria-controls="work-project-grid" onClick={() => { setExpanded(!expanded); setFilter('all'); }}><span>{expanded ? 'Close project index' : 'Explore all projects'} <small>({String(validProjects.length).padStart(2, '0')})</small></span><span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
      {expanded && <div id="work-project-grid" className="kinetic-archive-content">
        <div className="kinetic-filters" aria-label="Filter projects by discipline">{WORK_DISCIPLINES.map((discipline) => <button key={discipline.id} type="button" aria-pressed={filter === discipline.id} onClick={() => setFilter(discipline.id)}>{discipline.label}</button>)}</div>
        <p className="kinetic-mono kinetic-result-count" role="status">{archive.length} {archive.length === 1 ? 'project' : 'projects'} shown</p>
        {archive.map((project, index) => <ProjectAnchor className="kinetic-archive-row" key={project._id} project={project} source="kinetic_archive"><span className="kinetic-mono">{String(index + 1).padStart(2, '0')}</span><span className="kinetic-archive-title"><span className="kinetic-archive-thumbnail" aria-hidden="true"><SanityImage image={project.mainImage} sizes="(max-width: 700px) 56px, 80px" maxWidth={160} alt="" /></span><span>{project.title.trim()}</span></span><span className="kinetic-mono">{getProjectDisciplines(project).map((id) => WORK_DISCIPLINES.find((discipline) => discipline.id === id)?.label).join(' / ')}</span><span aria-hidden="true">↗</span></ProjectAnchor>)}
        {!archive.length && <p className="kinetic-status">No projects in this discipline yet.</p>}
      </div>}
    </div>}
  </section>;
}

export function KineticStudio({ projects, posts, error, isLoading, onRetry }) {
  const [formOpen, setFormOpen] = useState(false);
  const dune = projects.find((project) => project._id === 'e66165bf-e44e-489e-b0f3-bda746df25e0' && project.slug);
  const note = Array.isArray(posts) ? posts.find((post) => post.title && post.slug) : null;
  return <>
    <Reveal className="kinetic-ribbon"><div aria-hidden="true" className="kinetic-ribbon-track"><span>ALWAYS IN MOTION <i>✳</i> NEVER QUITE FINISHED <i>✳</i> </span><span>ALWAYS IN MOTION <i>✳</i> NEVER QUITE FINISHED <i>✳</i> </span></div><span className="kinetic-sr-only">Always in motion. Never quite finished.</span></Reveal>
    <section id="field-notes" className="kinetic-lab kinetic-wrap" aria-labelledby="kinetic-lab-title">
      <div className="kinetic-section-heading"><span className="kinetic-mono">02 / Experiments &amp; observations</span><Link className="kinetic-text-link" to="/rnd">R&amp;D index ↗</Link></div>
      <div className="kinetic-lab-grid"><div className="kinetic-lab-copy"><Reveal><h2 id="kinetic-lab-title">What if<span className="kinetic-acid">?</span><br />Let’s find out.</h2><p>Some ideas start with a brief.<br />Others start with a question.</p><p className="kinetic-secondary">A space for simulations, procedural systems and the discoveries that happen along the way.</p></Reveal>
        {note && <Reveal className="kinetic-note"><Link to={`/rnd/${encodeURIComponent(note.slug)}`}><div className="kinetic-note-image"><SanityImage image={note.mainImage} sizes="(max-width: 700px) 90vw, 35vw" alt={note.title} maxWidth={800} /></div><span className="kinetic-mono">From the notebook / Procedural design</span><h3>{note.title}<span aria-hidden="true">↗</span></h3>{note.excerpt && <p>{note.excerpt}</p>}</Link></Reveal>}
        {isLoading && <p role="status" className="kinetic-status">Loading experiments…</p>}
        {error && <p role="status" className="kinetic-status">The latest experiment couldn’t load. <button type="button" onClick={onRetry}>Try again</button></p>}
      </div>
      {dune && <Reveal className="kinetic-dune"><ProjectAnchor project={dune} source="kinetic_experiment"><div className="kinetic-dune-image"><SanityImage image={dune.mainImage} sizes="(max-width: 700px) 90vw, 45vw" alt={dune.title.trim()} maxWidth={1080} /><span className="kinetic-open">Explore study <span aria-hidden="true">↗</span></span></div><div className="kinetic-project-caption"><h3>{dune.title.trim()}</h3><span aria-hidden="true">↗</span></div><p className="kinetic-project-role">Houdini / Particle simulation</p></ProjectAnchor></Reveal>}
      </div>
    </section>
    <section id="resume" className="kinetic-about kinetic-wrap" aria-labelledby="kinetic-about-title">
      <div className="kinetic-section-heading"><span className="kinetic-mono">03 / The person behind the pixels</span><span className="kinetic-mono">Yu Xuan / yxperiments</span></div>
      <Reveal><h2 id="kinetic-about-title">An artist’s instinct.<br /><span>A builder’s mindset.</span></h2></Reveal>
      <div className="kinetic-about-body"><div className="kinetic-signature" aria-hidden="true">yx<StudioMark /></div><div><p className="kinetic-about-lead">I’m Yu Xuan. I work where image-making meets technology.</p><p>From Houdini simulations and character animation to motion design and interactive worlds, I bring ideas from early exploration through to the final experience.</p><div className="kinetic-about-actions"><a className="kinetic-text-link" href={EXTERNAL_LINKS.RESUME} target="_blank" rel="noopener noreferrer">View resume ↗</a><a className="kinetic-text-link" href={EXTERNAL_LINKS.DEMO_REEL} target="_blank" rel="noopener noreferrer">Watch showreel ↗</a></div></div></div>
      <div className="kinetic-capabilities">{CAPABILITY_CARDS.map((capability, index) => <details key={capability.title}><summary><span className="kinetic-mono">0{index + 1}</span><span>{capability.title}</span><span className="kinetic-capability-plus" aria-hidden="true">+</span></summary><div><p>{capability.description}</p><p className="kinetic-tools">{capability.tools.join(' / ')}</p></div></details>)}</div>
    </section>
    <section id="contact" className="kinetic-contact kinetic-wrap" aria-labelledby="kinetic-contact-title">
      <Reveal><div className="kinetic-contact-label"><span className="kinetic-mono">04 / Start a conversation</span><StudioMark /></div><div className="kinetic-contact-heading"><h2 id="kinetic-contact-title">Have a strange<br /><span>and wonderful idea?</span></h2><a className="kinetic-contact-orbit" href={`mailto:${SOCIAL_LINKS.EMAIL}`} aria-label="Email Yu Xuan"><span aria-hidden="true">↗</span></a></div><p>Let’s make something that stays with people.</p><a className="kinetic-email" href={`mailto:${SOCIAL_LINKS.EMAIL}`}>{SOCIAL_LINKS.EMAIL}</a></Reveal>
      <details className="kinetic-contact-form" open={formOpen} onToggle={(event) => setFormOpen(event.currentTarget.open)}><summary>Prefer to leave a message? <span aria-hidden="true">{formOpen ? '−' : '+'}</span></summary>{formOpen && <ContactSection embedded />}</details>
      <div className="kinetic-endnote kinetic-mono"><span>End of page. Beginning of something else.</span><Link to="/#home">Back to top ↑</Link></div>
    </section>
  </>;
}
