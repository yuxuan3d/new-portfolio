import React from 'react';
import styled from 'styled-components';
import { FaHammer, FaCode, FaMagic, FaPlay, FaFileAlt } from 'react-icons/fa';
import { EXTERNAL_LINKS } from '../constants/social';

const About = () => {
  const workflowPhases = [
    { step: '01', title: 'Discover', description: 'Collect references, define narrative goals, and lock tone.' },
    { step: '02', title: 'Prototype', description: 'Rapidly test motion, look-dev, and interaction mechanics.' },
    { step: '03', title: 'Polish', description: 'Refine detail, optimize delivery, and align final presentation.' },
  ];

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
        <HeaderPanel>
          <Kicker>About</Kicker>
          <Title as="h1">Hi! I&apos;m Yu Xuan</Title>
          <Subtitle as="p">Crafting digital experiences at the intersection of creativity and technology.</Subtitle>
          <IntroText>
            I combine cinematic aesthetics, practical production pipelines, and interactive tools to build visual stories that feel polished and playful.
          </IntroText>
          <ButtonContainer>
            <ActionButton
              href={EXTERNAL_LINKS.DEMO_REEL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch Demo Reel 2021"
            >
              <FaPlay aria-hidden="true" />
              <span>Demo Reel</span>
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
        </HeaderPanel>

        <StatsPanel aria-label="Experience highlights">
          <StatCard>
            <StatValue>3D + VFX</StatValue>
            <StatLabel>Simulation-driven visuals</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>Motion</StatValue>
            <StatLabel>Commercial and branded storytelling</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>React + Three.js</StatValue>
            <StatLabel>Interactive web experiments</StatLabel>
          </StatCard>
        </StatsPanel>
      </Header>

      <WorkflowStrip aria-label="Creative workflow">
        {workflowPhases.map((phase) => (
          <WorkflowCard key={phase.step}>
            <WorkflowStep>{phase.step}</WorkflowStep>
            <WorkflowTitle>{phase.title}</WorkflowTitle>
            <WorkflowDescription>{phase.description}</WorkflowDescription>
          </WorkflowCard>
        ))}
      </WorkflowStrip>

      <SkillsGrid as="section" role="region" aria-label="Professional Skills">
        {skillCategories.map((category) => (
          <SkillCard key={category.title} as="article">
            <IconWrapper>
              {category.icon}
            </IconWrapper>
            <CardTitle as="h2">{category.title}</CardTitle>
            <Description>{category.description}</Description>
            <ToolsList aria-label={`${category.title} tools and technologies`}>
              {category.tools.map((tool) => (
                <Tool key={tool} role="listitem">{tool}</Tool>
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
  padding: 2.9rem 0 4rem;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1.4rem;
  margin-bottom: 2.2rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const HeaderPanel = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 22px;
  padding: 1.65rem 1.5rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 16px 38px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
`;

const Kicker = styled.p`
  margin: 0 0 0.65rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3.2rem);
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.7rem;
  transition: color 0.3s ease;
  line-height: 1.04;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  max-width: 680px;
  margin: 0 0 0.6rem;
  transition: color 0.3s ease;
`;

const IntroText = styled.p`
  margin: 0 0 1.45rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  max-width: 58ch;
`;

const StatsPanel = styled.aside`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 22px;
  padding: 1.25rem;
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  box-shadow: 0 14px 34px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
  display: grid;
  gap: 0.9rem;
`;

const StatCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 1rem;
  background: ${({ theme }) => theme.surface};
`;

const StatValue = styled.p`
  margin: 0 0 0.35rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 800;
  font-size: 1rem;
`;

const StatLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.92rem;
  line-height: 1.45;
`;

const WorkflowStrip = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.15rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const WorkflowCard = styled.article`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 1rem;
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  box-shadow: 0 12px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};
  display: grid;
  gap: 0.45rem;
`;

const WorkflowStep = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
`;

const WorkflowTitle = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  color: ${({ theme }) => theme.text.primary};
`;

const WorkflowDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  box-shadow: 0 12px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 38px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.18)'};
  }
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.accent};
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
  margin-bottom: 0.2rem;
  transition: color 0.3s ease;
`;

const CardTitle = styled.h2`
  font-size: 1.35rem;
  color: ${({ theme }) => theme.text.primary};
  margin: 0;
  transition: color 0.3s ease;
`;

const Description = styled.p`
  font-size: 0.97rem;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.65;
  transition: color 0.3s ease;
`;

const ToolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
`;

const Tool = styled.span`
  background: ${({ theme }) => theme.accentSoft || `${theme.accent}20`};
  padding: 0.35rem 0.8rem;
  border-radius: 20px;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.accent};
  font-weight: 700;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.text};
  padding: 0.78rem 1.2rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 24px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: ${({ theme }) => theme.button.hover};
    transform: translateY(-2px);
    box-shadow: 0 14px 28px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.24)'};
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
`;

export default About; 
