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
  background: ${({ theme }) => theme.card.background};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const LazyImage = ({ src, alt, onLoad: parentOnLoad }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef();
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Disconnect the observer once the image is visible
          observerRef.current.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading images 50px before they enter the viewport
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
          alt={alt}
          onLoad={handleImageLoad}
          isLoaded={isLoaded}
        />
      )}
      <Placeholder isLoaded={isLoaded} />
    </ImageWrapper>
  );
};

export default LazyImage; 