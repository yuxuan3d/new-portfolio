import React, { useState } from 'react';
import styled from 'styled-components';
import { heroPresentation, imageDimensions, imageReference } from '../../lib/heroProjects';
import { urlFor } from '../../lib/sanityClient';

function mediaUrl(image, width, rect) {
  const dimensions = imageDimensions(image);
  if (!dimensions) return '';
  const source = { ...image, asset: { _ref: imageReference(image) } };
  if (rect) { delete source.crop; delete source.hotspot; }
  let builder = urlFor(source).auto('format').quality(78).width(Math.min(width, rect?.[2] || dimensions.width));
  if (rect) builder = builder.rect(...rect);
  return builder.url();
}

export function SanityImage({ image, rect, eager, sizes, alt, onReady, maxWidth = 1536 }) {
  const [failed, setFailed] = useState(false);
  const dimensions = imageDimensions(image);
  const max = Math.min(rect?.[2] || dimensions?.width || 0, maxWidth);
  const widths = [...new Set([350, 700, 1100, 1344, 1536].map((w) => Math.min(w, max)))].filter(Boolean);
  const src = mediaUrl(image, Math.min(700, max), rect);
  if (failed || !src) return <Unavailable role={alt ? 'img' : undefined} aria-label={alt || undefined}>Preview unavailable</Unavailable>;
  return <img src={src} srcSet={widths.map((w) => `${mediaUrl(image, w, rect)} ${w}w`).join(', ')}
    sizes={sizes} alt={alt} width={rect?.[2] || dimensions.width} height={rect?.[3] || dimensions.height}
    loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'low'} decoding="async" draggable="false"
    onLoad={onReady} onError={() => setFailed(true)} />;
}

export default function ProjectMedia({ project, decorative = false, eager = false, onReady, thumbnail = false, mode = 'finished' }) {
  const media = heroPresentation(project);
  if (thumbnail) return <Canvas><SanityImage image={media.image} rect={media.rect} sizes="120px" maxWidth={280} alt="" /></Canvas>;
  return <Canvas data-project-media={project._id}>
    {media.paired ? <>
      <Portrait data-media-view="finished" $active={mode !== 'notes'} aria-hidden={mode === 'notes' ? 'true' : undefined}><SanityImage image={media.image} eager={eager} sizes="(max-width: 767px) 100vw, 78vw" alt={decorative ? '' : 'Cinder virtual character'} onReady={onReady} /></Portrait>
      {media.companion && <Portrait data-media-view="notes" $active={mode === 'notes'} aria-hidden={mode !== 'notes' ? 'true' : undefined}><SanityImage image={media.companion} eager={eager} sizes="(max-width: 767px) 100vw, 78vw" maxWidth={500} alt={decorative ? '' : 'Cinder motion-capture setup; face blurred in the original photograph'} /></Portrait>}
    </>
    : <SanityImage image={media.image} rect={media.rect} eager={eager}
      sizes="(max-width: 767px) max(640px, calc((100vw - 40px) * 1.85)), (max-width: 1099px) calc(100vw - 96px), (min-width: 1411px) 1100px, 78vw"
      alt={decorative ? '' : `Preview of ${project.title}`} onReady={onReady} />}
  </Canvas>;
}

const Canvas = styled.div`
  position: relative; width: 100%; height: 100%; background: var(--surface); border-radius: inherit; overflow: hidden;
  > img { display: block; width: 100%; height: 100%; object-fit: cover; }
`;
const Portrait = styled.div`
  position: absolute; inset: 0;
  opacity: ${({ $active }) => $active ? 1 : 0}; transition: opacity 420ms ease;
  img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 32%; }
  @media(prefers-reduced-motion: reduce) { transition: none; }
`;
const Unavailable = styled.div`
  width: 100%; height: 100%; min-height: 44px; display: grid; place-items: center;
  color: var(--text-secondary); font-size: 14px; text-align: center;
`;
