import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { EXTERNAL_LINKS } from '../../constants/social';

export default function ResumeSection() {
  return <Section id="resume">
    <div><Label>04 / About</Label><h2>Yu Xuan</h2></div>
    <div><Lead>I create 3D, motion and interactive work across film, brand and web.</Lead>
      <Actions>
        <a href={EXTERNAL_LINKS.RESUME} target="_blank" rel="noopener noreferrer">Resume ↗</a>
        <a href={EXTERNAL_LINKS.DEMO_REEL} target="_blank" rel="noopener noreferrer">Showreel ↗</a>
        <Link to="/#field-notes">Field notes ↗</Link>
      </Actions>
    </div>
  </Section>;
}
const Section = styled.section`
  width: min(var(--site-max-width), calc(100% - var(--site-gutter) * 2)); margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1.8fr; gap: 64px; padding-top: 40px; border-top: 1px solid var(--border-strong);
  h2 { font: 600 clamp(44px, 5vw, 64px)/1 'Barlow Condensed', sans-serif; text-transform: uppercase; }
  p { color: var(--text-secondary); font-size: 16px; line-height: 1.8; max-width: 58ch; }
  @media(max-width: 767px) { grid-template-columns: 1fr; gap: 24px; }
`;
const Label = styled.span`display: block; font: 10px/1.5 'Roboto Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 18px;`;
const Lead = styled.p`
  && { font-size: clamp(20px, 2vw, 26px); color: var(--text-primary); line-height: 1.5; margin-bottom: 16px; }
`;
const Actions = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 24px;
  a { min-height: 44px; display: inline-flex; align-items: center; color: var(--accent); font-size: 14px; text-decoration: none; }
  a:hover { text-decoration: underline; text-underline-offset: 6px; }
`;
