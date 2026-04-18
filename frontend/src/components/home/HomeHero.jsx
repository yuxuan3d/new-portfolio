import React from 'react';
import { FaChevronDown, FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';
import styled, { css } from 'styled-components';
import { HERO_CONTENT } from '../../content/siteContent';
import { EXTERNAL_LINKS, SOCIAL_LINKS } from '../../constants/social';
import { MEDIA } from '../../styles/breakpoints';
import ParticleEarthFrame from '../ParticleEarthFrame';

const HERO_CONTACT_LINES = [
  { label: 'E', value: SOCIAL_LINKS.EMAIL, href: `mailto:${SOCIAL_LINKS.EMAIL}` },
];

const HERO_SOCIALS = [
  { label: 'LinkedIn', href: SOCIAL_LINKS.LINKEDIN, icon: FaLinkedin },
  { label: 'Instagram', href: SOCIAL_LINKS.INSTAGRAM, icon: FaInstagram },
  { label: 'Email', href: `mailto:${SOCIAL_LINKS.EMAIL}`, icon: FaEnvelope },
];

const HERO_RAIL_LINKS = [
  { label: 'Showreel', href: EXTERNAL_LINKS.DEMO_REEL },
  { label: 'Resume', href: EXTERNAL_LINKS.RESUME },
];

export default function HomeHero({ onParticleEarthReady }) {
  const hasDisplayTitle = Boolean(HERO_CONTENT.displayLead || HERO_CONTENT.displayAccent);

  const handleContinue = () => {
    const target = document.getElementById(HERO_CONTENT.primaryCta.id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Hero id="home">
      <ParticleEarthFrame onReady={onParticleEarthReady} />
      <HeroShade />

      <Overlay>
        <HeroCenter>
          {hasDisplayTitle ? (
            <DisplayTitle>
              {HERO_CONTENT.displayLead} <AccentWord>{HERO_CONTENT.displayAccent}</AccentWord>
            </DisplayTitle>
          ) : null}
        </HeroCenter>

        <DesktopContact>
          {HERO_CONTACT_LINES.map((line) => (
            <DesktopContactLine key={line.label}>
              <DesktopContactLabel>{line.label}:</DesktopContactLabel>
              {line.href ? (
                <DesktopContactLink href={line.href}>{line.value}</DesktopContactLink>
              ) : (
                <span>{line.value}</span>
              )}
            </DesktopContactLine>
          ))}
        </DesktopContact>

        <DesktopIntro>
          <DesktopIntroText>
            I&apos;m <DesktopIntroName>{HERO_CONTENT.name}</DesktopIntroName>, {HERO_CONTENT.description}
          </DesktopIntroText>
        </DesktopIntro>

        <DesktopScrollButton type="button" onClick={handleContinue} aria-label="Scroll to works">
          <FaChevronDown />
        </DesktopScrollButton>

        <DesktopFollow>
          <DesktopRailLinks>
            {HERO_RAIL_LINKS.map(({ label, href }) => (
              <DesktopRailTextLink key={label} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </DesktopRailTextLink>
            ))}
          </DesktopRailLinks>
          <DesktopFollowLabel>Follow Me</DesktopFollowLabel>
          <DesktopFollowRule aria-hidden="true" />
          <DesktopFollowLinks>
            {HERO_SOCIALS.map(({ label, href, icon }) => (
              <DesktopFollowLink key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                {React.createElement(icon, { size: 16 })}
              </DesktopFollowLink>
            ))}
          </DesktopFollowLinks>
        </DesktopFollow>

        <MobileHeroCard>
          <Content>
            <Eyebrow>{HERO_CONTENT.eyebrow}</Eyebrow>
            <Title>{HERO_CONTENT.supportTitle}</Title>
            <Subtitle>
              I&apos;m <MobileName>{HERO_CONTENT.name}</MobileName>, {HERO_CONTENT.description}
            </Subtitle>
          </Content>

          <ActionStack>
            <ActionRow>
              <PrimaryButton type="button" onClick={handleContinue}>
                {HERO_CONTENT.primaryCta.label}
              </PrimaryButton>
            </ActionRow>
            <MobileQuickLinks aria-label="Hero quick links">
              {HERO_RAIL_LINKS.map(({ label, href }) => (
                <MobileQuickLink key={label} href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </MobileQuickLink>
              ))}
            </MobileQuickLinks>
          </ActionStack>
        </MobileHeroCard>
      </Overlay>
    </Hero>
  );
}

const Hero = styled.section`
  position: relative;
  width: min(100%, 100vw);
  max-width: 100vw;
  min-height: 100svh;
  min-height: 100dvh;
  overflow: hidden;
  background: #0f1012;
`;

const HeroShade = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 43%, rgba(144, 213, 255, 0.1), transparent 15%),
    linear-gradient(180deg, rgba(5, 6, 8, 0.48), rgba(5, 6, 8, 0.12) 28%, rgba(5, 6, 8, 0.9) 100%);
  pointer-events: none;
`;

const Overlay = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100svh;
  min-height: 100dvh;
  padding:
    calc(var(--site-header-height, 96px) + clamp(0.35rem, 2vw, 0.8rem))
    var(--site-gutter)
    clamp(1.5rem, 4vw, 2.75rem);
  pointer-events: none;

  ${MEDIA.tabletDown} {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: stretch;
  }
`;

const HeroCenter = styled.div`
  min-height: calc(100svh - var(--site-header-height, 96px) - clamp(1.5rem, 4vw, 2.75rem));
  min-height: calc(100dvh - var(--site-header-height, 96px) - clamp(1.5rem, 4vw, 2.75rem));
  display: grid;
  align-items: center;
  justify-items: center;
  padding-bottom: clamp(7rem, 15vh, 10.5rem);
  text-align: center;

  ${MEDIA.tabletDown} {
    min-height: 0;
    padding-bottom: 0;
    align-items: end;
  }
`;

const DisplayTitle = styled.h1`
  width: min(100%, 1120px);
  margin: 0 auto;
  font-size: clamp(3.5rem, 6vw, 6.1rem);
  line-height: 0.96;
  color: ${({ theme }) => theme.text.primary};
  text-shadow: 0 18px 34px rgba(0, 0, 0, 0.42);

  ${MEDIA.tabletDown} {
    width: min(100%, 22rem);
    font-size: clamp(2.65rem, 11vw, 4.5rem);
  }
`;

const AccentWord = styled.span`
  color: ${({ theme }) => theme.accent};
`;

const DesktopContact = styled.div`
  position: fixed;
  left: var(--site-gutter);
  bottom: clamp(2rem, 4vw, 2.8rem);
  display: none;
  gap: 0.55rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.96rem;
  line-height: 1.8;
  z-index: 40;
  pointer-events: auto;

  ${MEDIA.wideUp} {
    display: grid;
  }
`;

const DesktopContactLine = styled.p`
  display: flex;
  gap: 0.45rem;
  align-items: baseline;
`;

const DesktopContactLabel = styled.span`
  color: ${({ theme }) => theme.text.muted};
`;

const DesktopContactLink = styled.a`
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
  }
`;

const DesktopIntro = styled.div`
  position: absolute;
  left: 50%;
  bottom: clamp(2rem, 4vw, 2.8rem);
  width: min(36rem, calc(100vw - 30rem));
  display: none;
  transform: translateX(-50%);
  text-align: center;

  ${MEDIA.wideUp} {
    display: block;
  }
`;

const DesktopIntroText = styled.p`
  color: ${({ theme }) => theme.text.primary};
  font-size: clamp(1.16rem, 1.45vw, 1.55rem);
  line-height: 1.52;
`;

const DesktopIntroName = styled.span`
  color: ${({ theme }) => theme.accent};
  font-weight: 700;
`;

const DesktopScrollButton = styled.button`
  position: absolute;
  right: clamp(9rem, 14vw, 14rem);
  bottom: clamp(2.5rem, 4.4vw, 3.5rem);
  display: none;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.7rem;
  cursor: pointer;
  pointer-events: auto;

  ${MEDIA.wideUp} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const DesktopFollow = styled.div`
  position: fixed;
  right: var(--site-gutter);
  bottom: clamp(2rem, 3.8vw, 2.8rem);
  display: none;
  justify-items: center;
  gap: 1.1rem;
  z-index: 40;
  pointer-events: auto;

  ${MEDIA.wideUp} {
    display: grid;
  }
`;

const sharedVerticalRailText = css`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
`;

const DesktopRailLinks = styled.div`
  display: grid;
  gap: 0.95rem;
  justify-items: center;
`;

const DesktopRailTextLink = styled.a`
  ${sharedVerticalRailText}
  color: ${({ theme }) => theme.text.primary};
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.accent};
    transform: translateY(-1px);
  }
`;

const DesktopFollowLabel = styled.span`
  ${sharedVerticalRailText}
  color: ${({ theme }) => theme.text.secondary};
`;

const DesktopFollowRule = styled.span`
  width: 1px;
  height: 3.35rem;
  background: ${({ theme }) => theme.borderStrong};
`;

const DesktopFollowLinks = styled.div`
  display: grid;
  gap: 1.05rem;
`;

const DesktopFollowLink = styled.a`
  color: ${({ theme }) => theme.text.secondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
    transform: translateY(-1px);
  }
`;

const MobileHeroCard = styled.div`
  width: min(100%, 32rem);
  margin: 0 auto;
  display: none;
  gap: 1rem;
  align-self: end;
  pointer-events: auto;

  ${MEDIA.tabletDown} {
    display: grid;
  }
`;

const Content = styled.div`
  max-width: 31rem;
  display: grid;
  gap: 0.6rem;
  text-align: left;
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.78rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Title = styled.p`
  max-width: 22ch;
  color: ${({ theme }) => theme.text.primary};
  font-size: clamp(1.15rem, 4.2vw, 1.55rem);
  line-height: 1.25;
`;

const Subtitle = styled.p`
  max-width: 34ch;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.98rem;
`;

const MobileName = styled.span`
  color: ${({ theme }) => theme.accent};
  font-weight: 700;
`;

const ActionStack = styled.div`
  display: grid;
  gap: 0.85rem;
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  gap: 0.75rem;

  ${MEDIA.phone} {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

const sharedButtonStyles = css`
  min-height: 48px;
  padding: 0.82rem 1rem;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  font-size: 0.74rem;
  font-weight: 500;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  ${MEDIA.phone} {
    width: 100%;
  }
`;

const PrimaryButton = styled.button`
  ${sharedButtonStyles}
  color: ${({ theme }) => theme.button.text};
  background: ${({ theme }) => theme.button.background};
  border-color: transparent;

  &:hover {
    background: ${({ theme }) => theme.button.hover};
  }
`;

const MobileQuickLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1rem;

  ${MEDIA.phone} {
    justify-content: space-between;
  }
`;

const MobileQuickLink = styled.a`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.72rem;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.12em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.accent};
    transform: translateY(-1px);
  }
`;
