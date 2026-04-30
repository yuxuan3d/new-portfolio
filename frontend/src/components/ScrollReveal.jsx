import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export default function ScrollReveal({
  as = 'div',
  children,
  className,
  delay = 0,
  distance = '28px',
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.16,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <RevealElement
      as={as}
      ref={ref}
      className={className}
      data-visible={isVisible ? 'true' : 'false'}
      style={{
        '--reveal-delay': `${delay}ms`,
        '--reveal-distance': distance,
      }}
    >
      {children}
    </RevealElement>
  );
}

const RevealElement = styled.div`
  opacity: 0;
  transform: translate3d(0, var(--reveal-distance, 28px), 0);
  will-change: opacity, transform;
  transition:
    opacity 560ms ease,
    transform 680ms cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--reveal-delay, 0ms);

  &[data-visible='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    will-change: auto;
  }

  @media (max-width: 640px) {
    transform: translate3d(0, min(var(--reveal-distance, 28px), 16px), 0);
    transition:
      opacity 260ms ease,
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    will-change: auto;
    transition: none;
  }
`;
