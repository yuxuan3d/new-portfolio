import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import styled, { css } from 'styled-components';
import { FaEnvelope, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { CONTACT_CONTENT } from '../content/siteContent';
import { MEDIA } from '../styles/breakpoints';

const ICONS = {
  Email: FaEnvelope,
  LinkedIn: FaLinkedin,
  Instagram: FaInstagram,
};

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactSection({ id, standalone = false }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });
  const title = CONTACT_CONTENT?.title ?? 'Contact';
  const contactMethods = Array.isArray(CONTACT_CONTENT?.contactMethods)
    ? CONTACT_CONTENT.contactMethods
    : [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setFormData(INITIAL_FORM_STATE);
      setStatus({ submitting: false, submitted: true, error: null });

      window.setTimeout(() => {
        setStatus((current) => ({ ...current, submitted: false }));
      }, 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: 'Failed to send message. Please try again later.',
      });
    }
  };

  return (
    <Section id={id} $standalone={standalone}>
      <SectionHeader>
        <Title>{title}</Title>
      </SectionHeader>

      <BodyGrid>
        <FormPanel>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                disabled={status.submitting}
                required
              />
            </FieldGroup>

            <FieldRow>
              <FieldGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status.submitting}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={status.submitting}
                  required
                />
              </FieldGroup>
            </FieldRow>

            <FieldGroup>
              <Label htmlFor="message">Message</Label>
              <TextArea
                id="message"
                name="message"
                rows="7"
                value={formData.message}
                onChange={handleChange}
                disabled={status.submitting}
                required
              />
            </FieldGroup>

            {status.error && <StatusMessage $tone="error">{status.error}</StatusMessage>}
            {status.submitted && (
              <StatusMessage $tone="success">Message sent successfully.</StatusMessage>
            )}

            <SubmitButton type="submit" disabled={status.submitting}>
              {status.submitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </Form>
        </FormPanel>

        {contactMethods.length > 0 ? (
          <InfoPanel>
            <MethodList>
              {contactMethods.map((method) => {
                const Icon = ICONS[method.label];
                return (
                  <MethodLink
                    key={method.label}
                    href={method.href}
                    target={method.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={method.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  >
                    <MethodIcon>{Icon ? <Icon /> : null}</MethodIcon>
                    <MethodCopy>
                      <MethodLabel>{method.label}</MethodLabel>
                      <MethodValue>{method.value}</MethodValue>
                    </MethodCopy>
                  </MethodLink>
                );
              })}
            </MethodList>
          </InfoPanel>
        ) : null}
      </BodyGrid>
    </Section>
  );
}

const Section = styled.section`
  width: ${({ $standalone }) =>
    $standalone
      ? 'min(var(--site-max-width), 100%)'
      : 'min(var(--site-max-width), calc(100% - (var(--site-gutter) * 2)))'};
  margin: 0 auto;
  padding: ${({ $standalone }) =>
    $standalone
      ? 'calc(var(--site-header-height, 96px) + clamp(1.1rem, 3vw, 2rem)) var(--site-gutter) 4rem'
      : '0'};
  display: grid;
  gap: 0.95rem;
`;

const SectionHeader = styled.header`
  display: grid;
  gap: 0.35rem;
  padding-left: var(--panel-padding);

  ${MEDIA.phone} {
    padding-left: 0;
  }
`;

const Title = styled.h2`
  font-size: clamp(1.55rem, 2.45vw, 2.35rem);
  color: ${({ theme }) => theme.text.primary};
  max-width: 20ch;
  text-wrap: pretty;
`;

const BodyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  min-width: 0;
`;

const panelStyles = css`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0;
  background: ${({ theme }) => theme.surfaceAlt};
`;

const FormPanel = styled.div`
  ${panelStyles}
  padding: var(--panel-padding);
  min-width: 0;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
  min-width: 0;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  ${MEDIA.phone} {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: grid;
  gap: 0.45rem;
  min-width: 0;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.68rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const sharedFieldStyles = css`
  width: 100%;
  min-height: 54px;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.input.border};
  background: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.text.primary};
  padding: 0.95rem 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.focus};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  ${sharedFieldStyles}
`;

const TextArea = styled.textarea`
  ${sharedFieldStyles}
  min-height: 200px;
  resize: vertical;
`;

const StatusMessage = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;
  border-radius: 16px;
  padding: 0.85rem 1rem;
  font-weight: 500;
  color: ${({ $tone }) => ($tone === 'success' ? '#9fe3bb' : '#ffb2a6')};
  background: ${({ $tone }) =>
    $tone === 'success' ? 'rgba(45, 105, 65, 0.18)' : 'rgba(140, 44, 32, 0.18)'};
  border: 1px solid ${({ $tone }) =>
    $tone === 'success' ? 'rgba(159, 227, 187, 0.24)' : 'rgba(255, 178, 166, 0.24)'};
`;

const SubmitButton = styled.button`
  min-height: 54px;
  width: fit-content;
  padding: 0.9rem 1.2rem;
  border-radius: 0;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.button.text};
  background: ${({ theme }) => theme.button.background};
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.button.hover};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  ${MEDIA.phone} {
    width: 100%;
  }
`;

const InfoPanel = styled.aside`
  padding: 0;
  display: grid;
  align-content: start;
  min-width: 0;
`;

const MethodList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;

  ${MEDIA.tabletOnly} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${MEDIA.phone} {
    grid-template-columns: 1fr;
  }
`;

const MethodLink = styled.a`
  min-height: 72px;
  min-width: 0;
  padding: 0.9rem 1rem;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.border};
  background: rgba(255, 255, 255, 0.03);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.accent};
  }
`;

const MethodIcon = styled.span`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accent};
  font-size: 1rem;
  flex-shrink: 0;
`;

const MethodCopy = styled.span`
  display: grid;
  gap: 0.1rem;
  min-width: 0;
`;

const MethodLabel = styled.span`
  color: ${({ theme }) => theme.text.muted};
  font-size: 0.68rem;
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const MethodValue = styled.span`
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.98rem;
  font-weight: 500;
  overflow-wrap: anywhere;
`;
