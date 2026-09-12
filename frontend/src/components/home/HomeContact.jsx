import React, { useState } from 'react';
import styled from 'styled-components';
import ContactSection from '../ContactSection';
import { SOCIAL_LINKS } from '../../constants/social';

export default function HomeContact() {
  const [open, setOpen] = useState(false);
  return <Section id="contact">
    <ContactHeading><h2>Have something<br />in mind?</h2><Talk href={`mailto:${SOCIAL_LINKS.EMAIL}`}>Let’s talk ↗</Talk></ContactHeading>
    <Email href={`mailto:${SOCIAL_LINKS.EMAIL}`}>{SOCIAL_LINKS.EMAIL} <span aria-hidden="true">↗</span></Email>
    <Disclosure open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>Send a message <span aria-hidden="true">{open ? '−' : '+'}</span></summary>
      {open && <ContactSection embedded />}
    </Disclosure>
  </Section>;
}
const Section = styled.section`
  width: min(var(--site-max-width), calc(100% - var(--site-gutter) * 2)); margin: 0 auto;
  > p { color: var(--text-secondary); font-size: 16px; margin-bottom: 20px; }
  h2 { font: 600 clamp(48px, 8vw, 100px)/1 'Barlow Condensed', sans-serif; text-transform: uppercase; }
`;
const Email = styled.a`
  display: inline-flex; flex-wrap: wrap; align-items: center; gap: 16px; min-height: 44px;
  margin-top: 24px; font-size: clamp(18px, 2.5vw, 30px); color: var(--accent); text-decoration: none;
  overflow-wrap: anywhere;
`;
const ContactHeading = styled.div`display: flex; align-items: center; justify-content: space-between; gap: 32px; @media(max-width: 767px) { display: grid; gap: 24px; }`;
const Talk = styled.a`display: inline-flex; align-items: center; justify-content: center; width: fit-content; min-height: 60px; padding: 12px 28px; background: var(--accent); color: var(--bg-base); border-radius: 4px; text-decoration: none; font: 600 32px/1.2 'Barlow Condensed', sans-serif; &:hover { background: #ffb38c; }`;
const Disclosure = styled.details`
  margin-top: 32px; border-top: 1px solid #ffffff25;
  summary { min-height: 56px; display: flex; align-items: center; gap: 16px; cursor: pointer; width: fit-content; color: var(--text-secondary); }
  summary::-webkit-details-marker { display: none; }
`;
