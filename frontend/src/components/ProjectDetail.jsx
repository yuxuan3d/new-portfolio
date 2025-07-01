import React, { memo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { urlFor } from '../lib/sanityClient';
import { useSanityData } from '../hooks/useSanityData';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

const VideoEmbed = memo(({ embedCode }) => (
  <VideoContainer>
    <VideoWrapper dangerouslySetInnerHTML={{ __html: embedCode }} />
  </VideoContainer>
));

const BackButtonWrapper = styled.div`
  margin-bottom: 2rem;
`;

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleBack = () => {
    setIsNavigating(true);
    navigate('/');
  };

  const [project] = useSanityData(`
    *[_type == "portfolioItem" && slug.current == "${slug}"][0] {
      _id,
      title,
      mainImage,
      additionalImages,
      description,
      videoEmbeds[] {
        embedCode
      },
      "arsenal": arsenal[]{
        "name": name
      },
      tags
    }
  `);

  if (!project) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <LoadingSpinner />
          <LoadingText>Loading Project</LoadingText>
          <LoadingDots>
            <Dot />
            <Dot />
            <Dot />
          </LoadingDots>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  // Only include additional images
  const allImages = project.additionalImages || [];

  return (
    <Container>
      <BackButtonWrapper>
        {isNavigating ? (
          <LoadingContainer style={{ margin: 0 }}>
            <LoadingContent>
              <LoadingSpinner />
              <LoadingText>Loading Projects</LoadingText>
              <LoadingDots>
                <Dot />
                <Dot />
                <Dot />
              </LoadingDots>
            </LoadingContent>
          </LoadingContainer>
        ) : (
          <BackButton onClick={handleBack}>← Back to Projects</BackButton>
        )}
      </BackButtonWrapper>
      
      <MainContent>
        <ContentGrid>
          <TextColumn>
            <Header>
              <Title>{project.title}</Title>
            </Header>

            {project.description && (
              <>
                <SectionTitle>Project Description</SectionTitle>
                <Description>{project.description}</Description>
              </>
            )}

            {project.arsenal && project.arsenal.length > 0 && (
              <ArsenalSection>
                <SectionTitle>The Arsenal</SectionTitle>
                <ToolsList>
                  {project.arsenal.map((tool, index) => (
                    <ToolItem key={index}>{tool.name}</ToolItem>
                  ))}
                </ToolsList>
              </ArsenalSection>
            )}

            {project.tags && project.tags.length > 0 && (
              <TagContainer>
                {project.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagContainer>
            )}
          </TextColumn>

          <MediaColumn>
            {project.videoEmbeds && project.videoEmbeds.length > 0 && (
              <VideosSection>
                {project.videoEmbeds.map((video, index) => (
                  <VideoEmbed key={index} embedCode={video.embedCode} />
                ))}
              </VideosSection>
            )}
          </MediaColumn>
        </ContentGrid>

        {allImages.length > 0 && (
          <ImagesSection>
            <ImagesGrid>
              {allImages.map((image, index) => (
                <ImageContainer key={index}>
                  <ProjectImage 
                    src={urlFor(image)
                      .auto('format')
                      .fit('max')
                      .quality(90)
                      .url()} 
                    alt={`${project.title} - Image ${index + 1}`}
                    loading="lazy"
                  />
                </ImageContainer>
              ))}
            </ImagesGrid>
          </ImagesSection>
        )}
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 6vw;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.text.secondary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const MainContent = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 12px;
  overflow: hidden;
  padding: 2rem;
  transition: background-color 0.3s ease;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 40%) 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextColumn = styled.div``;

const MediaColumn = styled.div``;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.text.primary};
`;

const Description = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text.secondary};
  white-space: pre-wrap;
  margin-bottom: 2rem;
`;

const ArsenalSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 1.5rem 0;
`;

const ToolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ToolItem = styled.span`
  background: ${({ theme }) => theme.card.background};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.card.hover};
    transform: translateY(-1px);
  }
`;

const VideosSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const VideoContainer = styled.div``;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  border-radius: 8px;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ImagesSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProjectImage = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.card.background};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const LoadingContainer = styled.div`
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.surface};
  border-radius: 12px;
  margin: 2rem 6vw;
  transition: background-color 0.3s ease;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${({ theme }) => theme.spinner.border};
  border-top: 3px solid ${({ theme }) => theme.spinner.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
  animation: ${fadeInOut} 2s ease-in-out infinite;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

export default ProjectDetail; 