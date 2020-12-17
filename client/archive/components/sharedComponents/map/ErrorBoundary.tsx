import {
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component, ErrorInfo } from 'react';
import styled from 'styled-components';
import {
  lightBaseColor,
  tertiaryColor,
} from '../../../styling/styleUtils';

const Root = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  background-color: ${tertiaryColor};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: ${lightBaseColor};
  box-sizing: border-box;
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Root>
          <Icon icon={faExclamationTriangle} />
          <div>
            Uh-oh, it looks like the map failed to load. Please try refreshing the page.
          </div>
        </Root>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
