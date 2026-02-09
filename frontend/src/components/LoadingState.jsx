import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

export default function LoadingState({
  label = 'Loading',
  minHeight = '34vh',
  margin = '1.25rem 0',
}) {
  return (
    <LoadingContainer role="status" aria-live="polite" $minHeight={minHeight} $margin={margin}>
      <LoadingContent>
        <LoadingSpinner />
        <LoadingText>{label}</LoadingText>
        <LoadingSubtext>Fetching latest content</LoadingSubtext>
        <LoadingDots>
          <Dot />
          <Dot />
          <Dot />
        </LoadingDots>
      </LoadingContent>
    </LoadingContainer>
  );
}

const LoadingContainer = styled.div`
  min-height: ${({ $minHeight }) => $minHeight};
  display: flex;
  justify-content: center;
  align-items: center;
  background:
    linear-gradient(160deg, ${({ theme }) => theme.surface} 0%, ${({ theme }) => theme.surfaceAlt || theme.surface} 100%);
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 12px 28px ${({ theme }) => theme.shadow || 'rgba(0, 0, 0, 0.12)'};
  margin: ${({ $margin }) => $margin};
  transition: background-color 0.3s ease;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 46px;
  height: 46px;
  border: 3px solid ${({ theme }) => theme.spinner.border};
  border-top: 3px solid ${({ theme }) => theme.spinner.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 0.45rem;
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 700;
  animation: ${fadeInOut} 2s ease-in-out infinite;
`;

const LoadingSubtext = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 600;
  margin-bottom: 0.35rem;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;
