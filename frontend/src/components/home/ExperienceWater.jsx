import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

// A traveling swell changes the contour shape, rather than sliding a still drawing.
// SVG updates are capped at 30fps and stop when the field is not visible.
function contourPath(row, time = 0) {
  const depth = row / 21;
  return Array.from({ length: 65 }, (_, column) => {
    const x = -80 + column * 25;
    const swell = Math.sin(x / 230 + depth * 1.8 - time * .32) * 40
      + Math.sin(x / 410 - depth * 1.2 + time * .19) * 30;
    const y = 24 + depth ** 1.25 * 205 + swell * (.45 + depth * .65);
    return `${column ? 'L' : 'M'}${x},${y.toFixed(2)}`;
  }).join(' ');
}
const contours = Array.from({ length: 22 }, (_, row) => ({ points: contourPath(row), major: row % 5 === 0, depth: row / 21 }));

export default function ExperienceWater({ running }) {
  const paths = useRef([]);
  const elapsed = useRef(0);
  useEffect(() => {
    if (!running) return undefined;
    let frame;
    let previous;
    let painted = 0;
    const animate = (now) => {
      if (previous !== undefined) elapsed.current += Math.min(now - previous, 64) / 1000;
      previous = now;
      if (now - painted >= 1000 / 30) {
        paths.current.forEach((path, row) => path?.setAttribute('d', contourPath(row, elapsed.current)));
        painted = now;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  return <Water aria-hidden="true" data-water data-water-style="contours" data-running={running}>
    <svg viewBox="0 0 1440 250" preserveAspectRatio="none" focusable="false">
      {contours.map(({ points, major, depth }, row) =>
        <path key={row} ref={(path) => { paths.current[row] = path; }} d={points} fill="none"
          stroke={major ? 'var(--accent-alt)' : 'currentColor'} strokeWidth={major ? 1.2 : .8}
          opacity={(major ? .9 : .6) * (1 - depth * .25)} vectorEffect="non-scaling-stroke" />)}
    </svg>
  </Water>;
}
const Water = styled.div`
  position: absolute; inset: 0; width: 100%; height: 100%;
  z-index: 0; pointer-events: none; overflow: hidden; color: var(--scene-rim);
  transition: color 620ms ease;
  mask-image: linear-gradient(transparent, #000 12%, #000 55%, transparent 100%);
  svg { display: block; width: 100%; height: 100%; }
  @media(prefers-reduced-motion: reduce) { transition: none; }
`;
