import React from 'react';
import styled from 'styled-components';
import { FaHammer, FaCode, FaMagic, FaPlay, FaFileAlt } from 'react-icons/fa';
import { EXTERNAL_LINKS } from '../constants/social';

const About = () => {
  const skillCategories = [
    {
      icon: <FaHammer size={32} aria-hidden="true" />,
      title: "3D & Visual Effects",
      description: "Specializing in high-quality 3D asset creation and physics-based visual effects. From concept to final render, crafting impactful visuals through modeling, texturing, and dynamic simulations. Expert in particle systems, fluids, and procedural effects for enhanced visual storytelling.",
      tools: ["Houdini", "3ds Max", "Maya", "Blender", "Substance Painter"]
    },
    {
      icon: <FaMagic size={32} aria-hidden="true" />,
      title: "Motion Graphics & Production",
      description: "Creating compelling 2D/3D motion graphics for commercial, broadcast, web, and interactive applications. Skilled in animation, visual effects compositing, and dynamic typography to deliver engaging visual narratives.",
      tools: ["After Effects", "Premiere Pro", "Photoshop"]
    },
    {
      icon: <FaCode size={32} aria-hidden="true" />,
      title: "Interactive Development & AI",
      description: "Building engaging web experiences with modern technologies, specializing in 3D web integration. Leveraging AI tools for workflow optimization and content creation, combining technical expertise with creative innovation.",
      tools: ["React", "Three.js", "Node.js", "Python", "AI Tools"]
    }
  ];

  return (
    <Container as="main" role="main">
      <Header as="header">
        <Title as="h1">Hi! I'm Yu Xuan</Title>
        <Subtitle as="p">Crafting digital experiences at the intersection of creativity and technology</Subtitle>
        <ButtonContainer>
          <ActionButton 
            href={EXTERNAL_LINKS.DEMO_REEL}
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Watch Demo Reel 2021"
          >
            <FaPlay aria-hidden="true" /> 
            <span>DemoReel 2021</span>
          </ActionButton>
          <ActionButton 
            href={EXTERNAL_LINKS.RESUME}
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Download Resume"
          >
            <FaFileAlt aria-hidden="true" /> 
            <span>Resume</span>
          </ActionButton>
        </ButtonContainer>
      </Header>

      <SkillsGrid as="section" role="region" aria-label="Professional Skills">
        {skillCategories.map((category) => (
          <SkillCard key={category.title} as="article">
            <IconWrapper>
              {category.icon}
            </IconWrapper>
            <CardTitle as="h2">{category.title}</CardTitle>
            <Description>{category.description}</Description>
            <ToolsList aria-label={`${category.title} tools and technologies`}>
              {category.tools.map((tool, toolIndex) => (
                <Tool key={toolIndex} role="listitem">{tool}</Tool>
              ))}
            </ToolsList>
          </SkillCard>
        ))}
      </SkillsGrid>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  transition: color 0.3s ease;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled.div`
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  box-shadow: 0 4px 6px ${({ theme }) => theme.card.hover};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px ${({ theme }) => theme.card.hover};
  }
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.accent};
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  transition: color 0.3s ease;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  transition: color 0.3s ease;
`;

const ToolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
`;

const Tool = styled.span`
  background: ${({ theme }) => theme.card.hover};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 500;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.card.hover};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
`;

const ActionButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.text};
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.button.hover};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
`;

export default About; 
