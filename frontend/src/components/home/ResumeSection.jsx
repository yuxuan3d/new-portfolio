import React from 'react';
import styled from 'styled-components';
import { MEDIA } from '../../styles/breakpoints';
import {
  CAPABILITY_CARDS,
  RESUME_CONTENT,
} from '../../content/siteContent';

export default function ResumeSection() {
  return (
    <Section id="resume">
      <SectionHeader>
        <Title>{RESUME_CONTENT.title}</Title>
      </SectionHeader>

      <IntroPanel>
        <Lead>{RESUME_CONTENT.intro}</Lead>
        <Body>{RESUME_CONTENT.description}</Body>
        <ActionRow>
          {RESUME_CONTENT.actions.map((action) => (
            <ActionLink key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">
              {action.label}
            </ActionLink>
          ))}
        </ActionRow>
      </IntroPanel>

      <CapabilityGrid aria-label="Capabilities">
        {CAPABILITY_CARDS.map((card) => (
          <CapabilityCard key={card.title}>
            <CapabilityTitle>{card.title}</CapabilityTitle>
            <CapabilityDescription>{card.description}</CapabilityDescription>
            <ToolList>
              {card.tools.map((tool) => (
                <Tool key={tool}>{tool}</Tool>
              ))}
            </ToolList>
          </CapabilityCard>
        ))}
      </CapabilityGrid>
    </Section>
  );
}

const Section = styled.section`
  width: min(var(--site-max-width), calc(100% - (var(--site-gutter) * 2)));
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 1.6rem) 0 0;
  display: grid;
  gap: 0.95rem;
`;

const SectionHeader = styled.header`
  display: grid;
  gap: 0.35rem;
`;

const Title = styled.h2`
  max-width: 20ch;
  font-size: clamp(1.55rem, 2.45vw, 2.35rem);
  color: ${({ theme }) => theme.text.primary};
  text-wrap: pretty;
`;

const IntroPanel = styled.div`
  max-width: 66ch;
  padding: var(--panel-padding) 0;
  display: grid;
  gap: 0.75rem;
  align-content: start;

  ${MEDIA.phone} {
    padding-top: 0.4rem;
  }
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.text.primary};
  font-size: clamp(1rem, 1.8vw, 1.18rem);
  line-height: 1.5;
`;

const Body = styled.p`
  max-width: 58ch;
  color: ${({ theme }) => theme.text.secondary};
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  ${MEDIA.phone} {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

const ActionLink = styled.a`
  min-height: 42px;
  padding: 0.75rem 0.9rem;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: ${({ theme }) => theme.accent};
  background: ${({ theme }) => theme.accentSurface};
  border: 1px solid ${({ theme }) => theme.accent};
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.button.text};
    background: ${({ theme }) => theme.button.background};
    border-color: ${({ theme }) => theme.button.background};
  }

  ${MEDIA.phone} {
    width: 100%;
  }
`;

const CapabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  ${MEDIA.tabletDown} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${MEDIA.phone} {
    grid-template-columns: 1fr;
  }
`;

const CapabilityCard = styled.article`
  padding: var(--panel-padding) 0 0;
  border-top: 1px solid ${({ theme }) => theme.borderStrong};
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CapabilityTitle = styled.h3`
  font-size: 1.22rem;
  color: ${({ theme }) => theme.text.primary};
`;

const CapabilityDescription = styled.p`
  color: ${({ theme }) => theme.text.secondary};
`;

const ToolList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: auto;
`;

const Tool = styled.span`
  min-height: 32px;
  padding: 0.45rem 0.7rem;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.accent};
  background: ${({ theme }) => theme.accentSurface};
  color: ${({ theme }) => theme.accent};
  font-size: 0.7rem;
  font-family: 'Roboto Mono', monospace;
`;
