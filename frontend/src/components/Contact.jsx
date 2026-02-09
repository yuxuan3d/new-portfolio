import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { SOCIAL_LINKS } from '../constants/social';

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus({
        submitting: false,
        submitted: true,
        error: null
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Show success message for 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);

    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus({
        submitting: false,
        submitted: false,
        error: 'Failed to send message. Please try again later.'
      });
    }
  };

  return (
    <Container>
      <Header>
        <Kicker>Contact</Kicker>
        <Title>Let&apos;s Connect</Title>
        <Subtitle>Have a project in mind? I&apos;d love to hear about it.</Subtitle>
        <MetaRow>
          <MetaChip>Usually replies within 2 business days</MetaChip>
          <MetaChip>Open to remote collaborations</MetaChip>
        </MetaRow>
      </Header>

      <ContentWrapper>
        <FormSection>
          <Form ref={form} onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={status.submitting}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={status.submitting}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={status.submitting}
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="message">Message</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                disabled={status.submitting}
              />
            </InputGroup>

            {status.error && (
              <ErrorMessage>{status.error}</ErrorMessage>
            )}

            {status.submitted && (
              <SuccessMessage>Message sent successfully!</SuccessMessage>
            )}

            <SubmitButton 
              type="submit" 
              disabled={status.submitting}
            >
              {status.submitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </Form>
        </FormSection>

        <ContactInfo>
          <InfoCard>
            <CardTitle>Get in Touch</CardTitle>
            <ContactText>
              Whether you have a project in mind or just want to chat, I'm always open to discussing new opportunities and ideas.
            </ContactText>
            <SocialLinks>
              <SocialLink href={`mailto:${SOCIAL_LINKS.EMAIL}`}>
                <FaEnvelope />
                <span>{SOCIAL_LINKS.EMAIL}</span>
              </SocialLink>
              <SocialLink href={SOCIAL_LINKS.LINKEDIN} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
                <span>LinkedIn</span>
              </SocialLink>
              <SocialLink href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
                <span>Instagram</span>
              </SocialLink>
            </SocialLinks>
          </InfoCard>
        </ContactInfo>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.9rem 0 4rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 22px;
  padding: 1.65rem 1.1rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 16px 38px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: auto -10% -70% auto;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: ${({ theme }) => theme.accentSoft || `${theme.accent}1f`};
    pointer-events: none;
  }
`;

const Kicker = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
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
  font-size: 1.06rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  transition: color 0.3s ease;
`;

const MetaRow = styled.div`
  margin-top: 0.95rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`;

const MetaChip = styled.span`
  display: inline-flex;
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.78rem;
  font-weight: 700;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 0.85fr;
  gap: 1.3rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormSection = styled.div`
  background: linear-gradient(160deg, ${({ theme }) => theme.surface} 0%, ${({ theme }) => theme.surfaceAlt || theme.surface} 100%);
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.45rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  box-shadow: 0 16px 36px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text.primary};
  transition: color 0.3s ease;
`;

const Input = styled.input`
  padding: 0.84rem;
  border: 1px solid ${({ theme }) => theme.input.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.text.primary};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.accentSoft || `${theme.accent}22`};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.84rem;
  border: 1px solid ${({ theme }) => theme.input.border};
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  background: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.text.primary};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.accentSoft || `${theme.accent}22`};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.text};
  padding: 0.95rem 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 24px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.2)'};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.button.hover};
    transform: translateY(-2px);
    box-shadow: 0 14px 30px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.24)'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 7.2rem;

  @media (max-width: 1024px) {
    position: static;
  }
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  border-radius: 20px;
  padding: 1.4rem;
  border: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.3s ease;
  box-shadow: 0 14px 32px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.14)'};
`;

const CardTitle = styled.h2`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
`;

const ContactText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin-bottom: 1.2rem;
  transition: color 0.3s ease;
`;

const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  font-size: 0.98rem;
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 0.7rem 0.75rem;
  background: ${({ theme }) => theme.surface};

  svg {
    font-size: 1rem;
    color: ${({ theme }) => theme.accent};
  }

  &:hover {
    color: ${({ theme }) => theme.button.text};
    background: ${({ theme }) => theme.button.background};
    border-color: ${({ theme }) => theme.accent};

    svg {
      color: ${({ theme }) => theme.button.text};
    }
  }
`;

const ErrorMessage = styled.div`
  color: #d44841;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  font-weight: 700;
`;

const SuccessMessage = styled.div`
  color: #0f8f60;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  font-weight: 700;
`;

export default Contact; 
