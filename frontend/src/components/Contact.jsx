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
        <Title>Let's Connect</Title>
        <Subtitle>Have a project in mind? I'd love to hear about it.</Subtitle>
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

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const FormSection = styled.div`
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  border-radius: 12px;
  padding: 2rem;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px ${({ theme }) => theme.card.hover};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  transition: color 0.3s ease;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.input.border};
  border-radius: 8px;
  font-size: 1rem;
  background: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.input.border};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  background: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.text.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.text};
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.button.hover};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.surfaceAlt || theme.surface};
  border-radius: 12px;
  padding: 2rem;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px ${({ theme }) => theme.card.hover};
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

const ContactText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
  margin-bottom: 2rem;
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
  gap: 1rem;
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s ease;

  svg {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.accent};
  }

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

export default Contact; 
