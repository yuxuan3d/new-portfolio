import React from 'react';
import styled from 'styled-components';

export default class LazyRouteBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPanel role="alert">
          <p>That page could not be loaded.</p>
          <button type="button" onClick={this.handleRetry}>Try again</button>
        </ErrorPanel>
      );
    }

    return this.props.children;
  }
}

const ErrorPanel = styled.div`
  width: min(var(--site-max-width), calc(100% - (var(--site-gutter) * 2)));
  min-height: 40vh;
  margin: calc(var(--site-header-height) + 2rem) auto 2rem;
  display: grid;
  place-content: center;
  gap: 1rem;
  text-align: center;

  button {
    min-height: 44px;
    padding: 0.7rem 1rem;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-primary);
    cursor: pointer;
  }
`;
