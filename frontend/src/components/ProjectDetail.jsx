import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { urlFor } from '../lib/sanityClient';
import { useSanityData } from '../hooks/useSanityData';
import LoadingState from './LoadingState';

const VideoEmbed = memo(({ embedCode }) => (
  <VideoContainer>
    <VideoWrapper dangerouslySetInnerHTML={{ __html: embedCode }} />
  </VideoContainer>
));

const BackButtonWrapper = styled.div`
  margin-bottom: 1rem;
`;

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const query = `
    *[_type == "portfolioItem" && slug.current == $slug][0] {
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
  `;

  const [project, error, { isValidating }] = useSanityData(query, { slug });

  if (error) {
    return (
      <Container>
        <BackButtonWrapper>
          <BackButton onClick={handleBack}>Back to Projects</BackButton>
        </BackButtonWrapper>
        <ErrorText>{error}</ErrorText>
      </Container>
    );
  }

  if (isValidating && !project) {
    return <LoadingState label="Loading Project" margin="2rem 0" />;
  }

  if (!project) {
    return (
      <Container>
        <BackButtonWrapper>
          <BackButton onClick={handleBack}>Back to Projects</BackButton>
        </BackButtonWrapper>
        <ErrorText>Project not found.</ErrorText>
      </Container>
    );
  }

  const allImages = project.additionalImages || [];

  return (
    <Container>
      <BackButtonWrapper>
        <BackButton onClick={handleBack}>Back to Projects</BackButton>
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
  padding: 2.6rem 0 3.5rem;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  padding: 0.62rem 1rem;
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.button.text};
    background: ${({ theme }) => theme.button.background};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const MainContent = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  padding: 1.55rem;
  transition: background-color 0.3s ease;
  box-shadow: 0 16px 38px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 40%) 1fr;
  gap: 1.5rem;
  margin-bottom: 2.3rem;

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
  font-size: clamp(2rem, 4vw, 3.2rem);
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.text.primary};
  line-height: 1.06;
`;

const Description = styled.div`
  font-size: 1rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.text.secondary};
  white-space: pre-wrap;
  margin-bottom: 2rem;
`;

const ArsenalSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.35rem;
  color: ${({ theme }) => theme.text.primary};
  margin: 0 0 1.1rem 0;
`;

const ToolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ToolItem = styled.span`
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.accent};
  font-weight: 700;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(1.05);
  }
`;

const VideosSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
`;

const VideoContainer = styled.div``;

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  box-shadow: 0 12px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};

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
  gap: 1rem;
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
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 12px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 38px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.border};
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #d44841;
  border: 1px solid rgba(212, 72, 65, 0.45);
  border-radius: 14px;
  background: rgba(212, 72, 65, 0.1);
`;

export default ProjectDetail;
