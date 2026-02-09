import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
`;

const BlogLazyImage = ({ src, alt, style, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <ImageWrapper className={className}>
      <StyledImage
        ref={imageRef}
        src={src}
        alt={alt}
        style={style}
        $isLoaded={isLoaded}
        onLoad={() => setIsLoaded(true)}
      />
    </ImageWrapper>
  );
};

export default BlogLazyImage;
