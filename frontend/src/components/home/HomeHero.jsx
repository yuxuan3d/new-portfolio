import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';
import styled, { css } from 'styled-components';
import { HERO_CONTENT } from '../../content/siteContent';
import { SOCIAL_LINKS } from '../../constants/social';
import ParticleEarthFrame from '../ParticleEarthFrame';

const DESKTOP_INTRO = {
  lead: "I'm",
  name: 'Yu Xuan',
  description:
    'a 3D motion designer creating cinematic visuals, interactive experiences, and polished post-production.',
};

const HERO_CONTACT_LINES = [
  { label: 'E', value: SOCIAL_LINKS.EMAIL, href: `mailto:${SOCIAL_LINKS.EMAIL}` },
];

const HERO_SOCIALS = [
  { label: 'LinkedIn', href: SOCIAL_LINKS.LINKEDIN, icon: FaLinkedin },
  { label: 'Instagram', href: SOCIAL_LINKS.INSTAGRAM, icon: FaInstagram },
  { label: 'Email', href: `mailto:${SOCIAL_LINKS.EMAIL}`, icon: FaEnvelope },
];

export default function HomeHero() {
  const [railOpacity, setRailOpacity] = useState(1);

  useEffect(() => {
    let frame = 0;

    const updateRailOpacity = () => {
      const footer = document.querySelector('footer');
      if (!footer) {
        setRailOpacity(1);
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const fadeStart = viewportHeight + 160;
      const fadeEnd = viewportHeight - 40;
      const progress = (fadeStart - footerTop) / (fadeStart - fadeEnd);
      const nextOpacity = 1 - Math.min(1, Math.max(0, progress));

      setRailOpacity((current) => (Math.abs(current - nextOpacity) < 0.02 ? current : nextOpacity));
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateRailOpacity);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);

  const handleContinue = () => {
    const target = document.getElementById(HERO_CONTENT.tertiaryCta.id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Hero id="home">
      <ParticleEarthFrame />
      <HeroShade />

      <Overlay>
        <HeroCenter>
          <DisplayTitle>
            I build <AccentWord>cinematic worlds</AccentWord>
          </DisplayTitle>
        </HeroCenter>

        <DesktopContact $railOpacity={railOpacity}>
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
            {DESKTOP_INTRO.lead} <DesktopIntroName>{DESKTOP_INTRO.name}</DesktopIntroName>,{' '}
            {DESKTOP_INTRO.description}
          </DesktopIntroText>
        </DesktopIntro>

        <DesktopScrollButton type="button" onClick={handleContinue} aria-label="Scroll to works">
          <FaChevronDown />
        </DesktopScrollButton>

        <DesktopFollow $railOpacity={railOpacity}>
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

        <MobileFooter>
          <Content>
            <Eyebrow>{HERO_CONTENT.eyebrow}</Eyebrow>
            <Title>{HERO_CONTENT.title}</Title>
            <Subtitle>{HERO_CONTENT.subtitle}</Subtitle>
          </Content>

          <Dock>
            <ActionRow>
              <PrimaryButton
                href={HERO_CONTENT.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {HERO_CONTENT.primaryCta.label}
              </PrimaryButton>
              <SecondaryButton to={HERO_CONTENT.secondaryCta.to}>
                {HERO_CONTENT.secondaryCta.label}
              </SecondaryButton>
            </ActionRow>

            <ScrollDock>
              <GhostButton type="button" onClick={handleContinue}>
                {HERO_CONTENT.tertiaryCta.label}
              </GhostButton>
              <ScrollButton type="button" onClick={handleContinue}>
                Continue
              </ScrollButton>
            </ScrollDock>
          </Dock>
        </MobileFooter>
      </Overlay>
    </Hero>
  );
}

const Hero = styled.section`
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  min-height: 100svh;
  min-height: 100dvh;
  overflow: hidden;
  background: #0f1012;
`;

const HeroShade = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 43%, rgba(73, 136, 196, 0.1), transparent 15%),
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
`;

const HeroCenter = styled.div`
  min-height: calc(100svh - var(--site-header-height, 96px) - clamp(1.5rem, 4vw, 2.75rem));
  min-height: calc(100dvh - var(--site-header-height, 96px) - clamp(1.5rem, 4vw, 2.75rem));
  display: grid;
  align-items: center;
  justify-items: center;
  padding-bottom: clamp(7rem, 15vh, 10.5rem);
  text-align: center;
`;

const DisplayTitle = styled.h1`
  width: min(100%, 1120px);
  margin: 0 auto;
  font-size: clamp(3.5rem, 6vw, 6.1rem);
  line-height: 0.96;
  color: ${({ theme }) => theme.text.primary};
  text-shadow: 0 18px 34px rgba(0, 0, 0, 0.42);

  @media (max-width: 900px) {
    width: min(100%, 700px);
    font-size: clamp(2.8rem, 10vw, 4.75rem);
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
  opacity: ${({ $railOpacity }) => $railOpacity};
  transform: translateY(${({ $railOpacity }) => (1 - $railOpacity) * 24}px);
  transition: opacity 0.22s ease, transform 0.22s ease;
  pointer-events: ${({ $railOpacity }) => ($railOpacity < 0.08 ? 'none' : 'auto')};

  @media (min-width: 1180px) {
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

  @media (min-width: 1180px) {
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

  @media (min-width: 1180px) {
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
  opacity: ${({ $railOpacity }) => $railOpacity};
  transform: translateY(${({ $railOpacity }) => (1 - $railOpacity) * 24}px);
  transition: opacity 0.22s ease, transform 0.22s ease;
  pointer-events: ${({ $railOpacity }) => ($railOpacity < 0.08 ? 'none' : 'auto')};

  @media (min-width: 1180px) {
    display: grid;
  }
`;

const DesktopFollowLabel = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  font-family: 'Roboto Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
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

const MobileFooter = styled.div`
  width: min(var(--site-max-width), calc(100vw - (var(--site-gutter) * 2)));
  margin: 0 auto;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  padding-top: 1rem;

  @media (min-width: 1180px) {
    display: none;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Content = styled.div`
  max-width: 31rem;
  display: grid;
  gap: 0.55rem;
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
  font-size: clamp(1.3rem, 2.1vw, 1.8rem);
  line-height: 1.25;
`;

const Subtitle = styled.p`
  max-width: 42ch;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 1rem;
`;

const Dock = styled.div`
  display: grid;
  gap: 1rem;
  justify-items: end;
  pointer-events: auto;

  @media (max-width: 900px) {
    justify-items: start;
  }
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;

  @media (max-width: 900px) {
    justify-content: flex-start;
  }
`;

const sharedButtonStyles = css`
  min-height: 46px;
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
`;

const PrimaryButton = styled.a`
  ${sharedButtonStyles}
  color: ${({ theme }) => theme.button.text};
  background: ${({ theme }) => theme.button.background};
  border-color: transparent;

  &:hover {
    background: ${({ theme }) => theme.button.hover};
  }
`;

const SecondaryButton = styled(Link)`
  ${sharedButtonStyles}
  color: ${({ theme }) => theme.text.primary};
  background: rgba(16, 16, 16, 0.82);
`;

const GhostButton = styled.button`
  ${sharedButtonStyles}
  color: ${({ theme }) => theme.text.secondary};
  background: transparent;
`;

const ScrollDock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const ScrollButton = styled.button`
  ${sharedButtonStyles}
  min-height: 40px;
  padding: 0.65rem 0.9rem;
  color: ${({ theme }) => theme.text.primary};
  background: rgba(16, 16, 16, 0.82);
`;
