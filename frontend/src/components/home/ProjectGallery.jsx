import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { heroPresentation, projectPath, selectHeroProjects, wrapSlide } from '../../lib/heroProjects';
import { trackProjectOpen } from '../../lib/siteEvents';
import ProjectMedia from './ProjectMedia';
import ExperienceWater from './ExperienceWater';

export default function ProjectGallery({ projects, error, isLoading, onRetry, overlayOpen }) {
  const items = useMemo(() => selectHeroProjects(projects), [projects]);
  const [selectedId, setSelectedId] = useState(null);
  const [mediaModes, setMediaModes] = useState({});
  const [moving, setMoving] = useState(false);
  const [wrappedId, setWrappedId] = useState(null);
  const [ready, setReady] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [wide, setWide] = useState(false);
  const [saving, setSaving] = useState(false);
  const region = useRef(null);
  const stage = useRef(null);
  const pointer = useRef(null);
  const settleTimer = useRef(null);
  const location = useLocation();
  const index = Math.max(0, items.findIndex((p) => p._id === selectedId));
  const active = items[index];
  const ambientRunning = !reduced && visible && documentVisible && !saving && !overlayOpen;
  const running = ready && !moving && wide && ambientRunning;

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 1100px)');
    const update = () => { setReduced(motion.matches); setWide(desktop.matches); setSaving(Boolean(navigator.connection?.saveData)); };
    const visibility = () => setDocumentVisible(!document.hidden);
    update(); visibility();
    motion.addEventListener('change', update); desktop.addEventListener('change', update);
    navigator.connection?.addEventListener?.('change', update);
    document.addEventListener('visibilitychange', visibility);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer?.observe(region.current);
    return () => {
      motion.removeEventListener('change', update); desktop.removeEventListener('change', update);
      navigator.connection?.removeEventListener?.('change', update);
      document.removeEventListener('visibilitychange', visibility); observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Do not compete with the first poster, even on a slow content connection.
    if (!posterReady) return undefined;
    const timer = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(timer);
  }, [posterReady]);

  const select = (next) => {
    if (!items.length) return;
    const nextIndex = wrapSlide(next, items.length);
    if (nextIndex === index) return;
    setWrappedId(items.find((_, i) => i !== index && i !== nextIndex)?._id || null);
    setMoving(!reduced);
    setSelectedId(items[nextIndex]._id);
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => { setMoving(false); setWrappedId(null); }, reduced ? 0 : 640);
    stage.current?.style.setProperty('--tilt-x', '0deg');
    stage.current?.style.setProperty('--tilt-y', '0deg');
  };
  const clearPointer = () => {
    pointer.current = null;
    stage.current?.style.setProperty('--tilt-x', '0deg');
    stage.current?.style.setProperty('--tilt-y', '0deg');
  };

  return <Gallery ref={region} data-tone={heroPresentation(active).tone} role="region" aria-label="Selected project gallery" aria-roledescription="carousel"
    onKeyDown={(event) => {
      if (/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.closest('[data-media-switch]') || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); select(index + (event.key === 'ArrowRight' ? 1 : -1));
      }
    }}>
    <Atmosphere aria-hidden="true" />
    <Stage ref={stage} data-gallery-stage data-transitioning={moving}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0 || event.target.closest('a, button')) return;
        pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false };
      }}
      onPointerMove={(event) => {
        const start = pointer.current;
        if (start?.id === event.pointerId) {
          const dx = event.clientX - start.x, dy = event.clientY - start.y;
          if (!start.horizontal && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { pointer.current = null; return; }
          if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            start.horizontal = true; event.currentTarget.setPointerCapture(event.pointerId);
          }
        } else if (running && event.pointerType === 'mouse') {
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty('--tilt-y', `${(event.clientX / bounds.width - .5) * 5}deg`);
          event.currentTarget.style.setProperty('--tilt-x', `${((event.clientY - bounds.top) / bounds.height - .5) * -3}deg`);
        }
      }}
      onPointerUp={(event) => {
        const start = pointer.current;
        if (start?.id === event.pointerId && start.horizontal && Math.abs(event.clientX - start.x) > 40) select(index + (event.clientX < start.x ? 1 : -1));
        clearPointer();
      }}
      onPointerCancel={clearPointer}
      onLostPointerCapture={clearPointer}
      onPointerLeave={() => { if (!pointer.current) clearPointer(); }}>
      {active ? items.map((project, itemIndex) => {
        const media = heroPresentation(project);
        const mode = media.companion ? (mediaModes[project._id] || 'finished') : 'finished';
        const offset = itemIndex === index ? 0 : (itemIndex === wrapSlide(index + 1, items.length) ? 1 : -1);
        if (offset && !ready) return null;
        return <Panel key={project._id} data-gallery-panel $offset={offset} $wrapping={project._id === wrappedId} $immediate={reduced}
          aria-hidden={offset !== 0 ? 'true' : undefined} role={offset === 0 ? 'group' : undefined}
          aria-label={offset === 0 ? `${index + 1} of ${items.length}: ${project.title}` : undefined}>
          <Frame $active={offset === 0 && running}>
            <ProjectMedia project={project} mode={mode} decorative={offset !== 0} eager={offset === 0 || (ready && !saving)} onReady={offset === 0 ? () => setPosterReady(true) : undefined} />
            {media.companion && offset === 0 && <MediaSwitch data-media-switch role="group" aria-label={`${project.title} media view`}>
              {['finished', 'notes'].map((view) => <button key={view} type="button" tabIndex={offset === 0 ? 0 : -1} aria-pressed={mode === view}
                onClick={() => setMediaModes((previous) => ({ ...previous, [project._id]: view }))}>{view === 'finished' ? 'Finished' : 'Field notes'}</button>)}
            </MediaSwitch>}
            <Caption data-gallery-caption={offset === 0 ? '' : undefined} $portrait={media.paired} $active={offset === 0} $immediate={reduced}>
              <Eyebrow>Selected project / {String(itemIndex + 1).padStart(2, '0')}</Eyebrow>
              <h2>{project.title}</h2><p>{mode === 'notes' ? 'From performance to character. / Capture setup' : media.role}</p>
              <ProjectAction tabIndex={offset === 0 ? 0 : -1} to={projectPath(project)} state={{ backgroundLocation: location }}
                onClick={() => trackProjectOpen(project, 'hero', { position: index + 1 })}>View project <span aria-hidden="true">↗</span></ProjectAction>
            </Caption>
          </Frame>
        </Panel>;
      }) : <Placeholder role="status">
        {isLoading ? 'Loading selected work…' : error ? 'The projects could not be loaded.' : 'New work will appear here soon.'}
        {!isLoading && <button type="button" onClick={onRetry}>Try again</button>}
      </Placeholder>}
    </Stage>
    <Foreground>
      <Controls aria-label="Gallery controls">
        <Arrow type="button" aria-label="Previous project" disabled={items.length < 2} onClick={() => select(index - 1)}>‹</Arrow>
        <Count aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</Count>
        <Selectors aria-label="Choose a project">{items.map((project, i) =>
          <Selector type="button" key={project._id} aria-label={`Show ${project.title}`} aria-current={i === index ? 'true' : undefined}
            onClick={() => select(i)}><ProjectMedia project={project} decorative thumbnail /><span>{String(i + 1).padStart(2, '0')} / {heroPresentation(project).short}</span></Selector>)}</Selectors>
        <Arrow type="button" aria-label="Next project" disabled={items.length < 2} onClick={() => select(index + 1)}>›</Arrow>
      </Controls>
      <Announcement aria-live="polite" aria-atomic="true">{active ? `${index + 1} of ${items.length}. ${active.title}. ${mediaModes[active._id] === 'notes' ? 'Field notes. Capture setup.' : 'Finished work.'}` : ''}</Announcement>
    </Foreground>
    <WaterSlot>{active && <ExperienceWater running={ambientRunning} />}</WaterSlot>
    <ScrollCue to="/#awards" data-scroll-cue>Scroll to discover <span aria-hidden="true">↓</span></ScrollCue>
  </Gallery>;
}

const Gallery = styled.div`
  container-type: inline-size; position: relative; isolation: isolate;
  --gallery-width: min(78vw, 1100px, calc((100svh - 304px) * 1.7778));
  --gallery-height: min(43.875vw, 618.75px, calc(100svh - 304px));
  --scene-glow: #35201988; --scene-rim: var(--accent); --scene-rgb: 255, 153, 102;
  min-height: calc(100svh - 125px); padding-bottom: 56px;
  @media(min-width: 768px) and (max-width: 1099px) { --gallery-width: calc(100vw - 96px); --gallery-height: calc((100vw - 96px) * .5625); }
  @media(max-width: 767px) {
    --gallery-width: calc(100cqw - 40px); --gallery-height: max(420px, calc((100cqw - 40px) * 1.04));
    min-height: calc(100svh - 112px); padding-bottom: 44px;
  }
  @media(max-width: 359px) { --gallery-width: calc(100cqw - 32px); --gallery-height: 420px; }
`;
const Atmosphere = styled.div`
  position: absolute; z-index: -1; inset: -100px 0 -20px; pointer-events: none;
  background: radial-gradient(ellipse at 50% 40%, #35201988, transparent 72%);
  @media(prefers-reduced-motion: reduce) { transition: none; }
`;
const Stage = styled.div`
  position: relative; height: var(--gallery-height); width: 100%; isolation: isolate;
  touch-action: pan-y; user-select: none; cursor: grab;
  --tilt-x: 0deg; --tilt-y: 0deg;
  &:active { cursor: grabbing; }
`;
const panelTransform = (offset) => `translate3d(calc(-50% + ${offset} * var(--gallery-width) * .88), 0, 0) perspective(1500px) scale(${offset ? .76 : 1}) rotateY(${offset * -15}deg)`;
const wrapLeft = keyframes`
  0% { transform: ${panelTransform(1)}; opacity: .75; }
  25% { transform: ${panelTransform(1)}; opacity: 0; }
  26%, 55% { transform: ${panelTransform(-1)}; opacity: 0; }
  100% { transform: ${panelTransform(-1)}; opacity: .75; }
`;
const wrapRight = keyframes`
  0% { transform: ${panelTransform(-1)}; opacity: .75; }
  25% { transform: ${panelTransform(-1)}; opacity: 0; }
  26%, 55% { transform: ${panelTransform(1)}; opacity: 0; }
  100% { transform: ${panelTransform(1)}; opacity: .75; }
`;
const Panel = styled.div`
  position: absolute; top: 0; left: 50%; width: var(--gallery-width); height: var(--gallery-height);
  z-index: ${({ $offset }) => $offset === 0 ? 2 : 1};
  transform: ${({ $offset }) => panelTransform($offset)};
  opacity: ${({ $offset }) => $offset ? .75 : 1};
  will-change: transform, opacity;
  transition: ${({ $immediate }) => $immediate ? 'none' : 'transform 620ms cubic-bezier(.22, 1, .36, 1), opacity 480ms ease'};
  animation-name: ${({ $wrapping, $offset, $immediate }) => $wrapping && !$immediate ? ($offset < 0 ? wrapLeft : wrapRight) : 'none'};
  animation-duration: 620ms; animation-timing-function: ease; animation-fill-mode: both;
  @media(max-width: 1099px) {
    transform: translate3d(calc(-50% + ${({ $offset }) => $offset * 24}px), 0, 0) scale(${({ $offset }) => $offset ? .97 : 1});
    opacity: ${({ $offset }) => $offset ? 0 : 1};
    pointer-events: ${({ $offset }) => $offset ? 'none' : 'auto'};
    animation: none;
  }
`;
const Frame = styled.div`
  position: relative; height: 100%; border-radius: 8px; border: 1px solid #bdb1a866; overflow: hidden;
  transform: perspective(1500px) rotateY(${({ $active }) => $active ? 'var(--tilt-y)' : '0deg'}) rotateX(${({ $active }) => $active ? 'var(--tilt-x)' : '0deg'});
  transition: transform 240ms ease-out;
  box-shadow: 0 24px 80px #00000055; background: var(--surface);
  @media(max-width: 767px) { border-radius: 6px; }
`;
const Foreground = styled.div`
  width: var(--gallery-width); margin: 20px auto 0;
  @media(min-width: 1100px) { margin-top: 0; }
`;
const WaterSlot = styled.div`
  position: relative; width: 100%; height: 88px; margin-top: 32px;
  @media(max-width: 767px) { height: 78px; margin-top: 26px; }
`;
const MediaSwitch = styled.div`
  position: absolute; top: 20px; left: 24px; z-index: 3; display: flex;
  border: 1px solid var(--border-strong); border-radius: 4px; overflow: hidden; background: var(--bg-base);
  button { min-height: 44px; padding: 8px 18px; background: transparent; color: var(--text-secondary); border: 0; cursor: pointer; font: 12px/1.3 'Roboto Mono', monospace; }
  button[aria-pressed='true'] { background: var(--accent); color: var(--bg-base); }
  @media(max-width: 767px) { top: 10px; left: 50%; transform: translateX(-50%); white-space: nowrap; }
`;
const Caption = styled.div`
  position: absolute; inset: 0; padding: 36px 40px; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;
  opacity: ${({ $active }) => $active ? 1 : 0}; pointer-events: ${({ $active }) => $active ? 'auto' : 'none'};
  transition: ${({ $immediate }) => $immediate ? 'none' : 'opacity 480ms ease'};
  background: linear-gradient(180deg, #100e0d12 10%, transparent 25%, #100e0d99 73%, #100e0de8 100%);
  h2 { max-width: 85%; font-family: 'Barlow Condensed', sans-serif; font-size: clamp(48px, 6.5vw, 88px); line-height: .95; font-weight: 600; letter-spacing: -.015em; text-transform: uppercase; text-wrap: balance; }
  h2, p { max-width: 85%; }
  p { color: var(--text-primary); font-size: 13px; line-height: 20px; margin-top: 12px; }
  @media(max-width: 767px) {
    padding: 20px; h2 { font-size: 44px; max-width: 100%; } p { max-width: 100%; font-size: 12px; line-height: 18px; margin-top: 8px; }
    > span { display: ${({ $portrait }) => $portrait ? 'none' : 'block'}; }
  }
  @media(max-width: 359px) { padding: 20px; h2 { font-size: 38px; } }
  @media(min-width: 1100px) and (max-height: 600px) { padding: 20px; h2 { font-size: 42px; } p { margin-top: 6px; } }
`;
const Eyebrow = styled.span`
  margin-bottom: 12px; font: 12px/1.5 'Roboto Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--text-primary);
`;
const ProjectAction = styled(Link)`
  display: inline-flex; align-items: center; justify-content: center; gap: 12px; white-space: nowrap;
  min-height: 44px; padding: 0 22px; margin-top: 20px; border-radius: 3px; background: var(--accent); color: var(--bg-base);
  font: 11px/1 'Roboto Mono', monospace; letter-spacing: .06em; text-transform: uppercase; text-decoration: none; font-weight: 500;
  &:hover { background: #fff; } span { font-size: 20px; }
  @media(max-width: 767px) { margin-top: 16px; }
`;
const Controls = styled.div`
  display: flex; align-items: center; gap: 16px; min-height: 78px;
  @media(min-width: 1100px) { min-height: 0; }
  @media(max-width: 767px) {
    display: grid; grid-template-columns: 44px minmax(54px, 1fr) 44px; gap: 12px 8px; min-height: 44px;
  }
  @media(max-width: 359px) { column-gap: 4px; }
`;
const Arrow = styled.button`
  position: absolute; z-index: 4; right: 24px; top: calc(var(--gallery-height) * .5 - 50px);
  &:last-of-type { top: calc(var(--gallery-height) * .5 + 10px); }
  width: 44px; height: 44px; flex: 0 0 44px; border-radius: 50%; border: 1px solid #a2b8c366;
  color: var(--text-primary); background: #191513ed; cursor: pointer; font-size: 26px; line-height: 1;
  &:hover { border-color: var(--scene-rim); color: var(--scene-rim); } &:disabled { opacity: .35; cursor: default; }
  @media(max-width: 767px) { position: relative; right: auto; top: auto; &:last-of-type { top: auto; } }
`;
const Selectors = styled.div`
  position: relative; z-index: 3; display: flex; margin-left: auto; gap: 12px;
  @media(min-width: 1100px) { position: absolute; top: calc(var(--gallery-height) - 88px); right: calc((100% - var(--gallery-width)) / 2 + 24px); }
  @media(max-width: 767px) { display: none; }
`;
const Selector = styled.button`
  position: relative; width: 108px; height: 64px; padding: 0; border: 1px solid var(--border-strong); border-radius: 4px; overflow: hidden;
  background: var(--surface); color: var(--text-primary); cursor: pointer; opacity: .72; transition: opacity 300ms ease, border-color 620ms ease;
  span { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 8px; background: linear-gradient(transparent 25%, #020609e6); font: 9px/1.2 'Roboto Mono', monospace; text-transform: uppercase; letter-spacing: .03em; }
  &:hover { opacity: 1; } &[aria-current] { opacity: 1; border-color: var(--scene-rim); box-shadow: 0 0 18px rgba(var(--scene-rgb), .15); }
  @media(max-width: 767px) { width: 100%; height: 70px; }
`;
const Count = styled.span`
  position: relative; z-index: 3; font: 12px/1.5 'Roboto Mono', monospace; letter-spacing: .12em; color: var(--text-secondary);
  @media(max-width: 767px) { text-align: center; }
  @media(min-width: 1100px) { display: none; }
`;
const ScrollCue = styled(Link)`
  position: relative; z-index: 3; display: flex; align-items: center; justify-content: center; gap: 14px; min-height: 44px;
  margin-top: 12px; color: var(--text-secondary); font: 12px/1.5 'Roboto Mono', monospace; letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
`;
const Announcement = styled.p`
  position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%);
`;
const Placeholder = styled.div`
  width: var(--gallery-width); height: 100%; margin: auto; border: 1px solid #ffffff22; border-radius: 16px;
  background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
  text-align: center; color: var(--text-secondary); padding: 20px;
  button { min-height: 44px; padding: 8px 20px; cursor: pointer; }
`;
