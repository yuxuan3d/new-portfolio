import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.card.background};
  position: relative;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease, filter 0.3s ease;
  opacity: ${({ isLoaded }) => (isLoaded ? 1 : 0)};
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme, blurDataURL }) => blurDataURL ? `url(${blurDataURL})` : theme.card.background};
  background-size: cover;
  background-position: center;
  filter: ${({ blurDataURL }) => blurDataURL ? 'blur(20px)' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const LazyImage = ({ src, alt, onLoad: parentOnLoad, sizes = "100vw" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurDataURL, setBlurDataURL] = useState('');
  const imageRef = useRef();
  const observerRef = useRef();

  // Generate srcSet from the original src
  const generateSrcSet = (src) => {
    const widths = [400, 800, 1200, 1600];
    return widths
      .map((width) => {
        const url = new URL(src);
        const baseWidth = parseInt(url.searchParams.get('w') || '', 10);
        const baseHeight = parseInt(url.searchParams.get('h') || '', 10);
        const hasBaseSize = Number.isFinite(baseWidth) && baseWidth > 0 && Number.isFinite(baseHeight) && baseHeight > 0;
        const ratio = hasBaseSize ? baseHeight / baseWidth : null;

        url.searchParams.set('w', width.toString());
        if (ratio) {
          url.searchParams.set('h', Math.round(width * ratio).toString());
        }
        return `${url.toString()} ${width}w`;
      })
      .join(', ');
  };

  // Generate blur placeholder
  useEffect(() => {
    if (src) {
      const url = new URL(src);
      const baseWidth = parseInt(url.searchParams.get('w') || '', 10);
      const baseHeight = parseInt(url.searchParams.get('h') || '', 10);
      const hasBaseSize = Number.isFinite(baseWidth) && baseWidth > 0 && Number.isFinite(baseHeight) && baseHeight > 0;
      const ratio = hasBaseSize ? baseHeight / baseWidth : null;

      url.searchParams.set('w', '50');
      if (ratio) {
        url.searchParams.set('h', Math.round(50 * ratio).toString());
      }
      url.searchParams.set('blur', '50');
      url.searchParams.set('q', '20');
      setBlurDataURL(url.toString());
    }
  }, [src]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observerRef.current.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      observerRef.current.observe(imageRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (parentOnLoad) {
      parentOnLoad();
    }
  };

  return (
    <ImageWrapper ref={imageRef}>
      {isVisible && (
        <StyledImage
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          onLoad={handleImageLoad}
          isLoaded={isLoaded}
          loading="lazy"
          decoding="async"
        />
      )}
      <Placeholder isLoaded={isLoaded} blurDataURL={blurDataURL} />
    </ImageWrapper>
  );
};

export default LazyImage; 
