import {captureException} from '@sentry/react';
import React from 'react';
import styled from 'styled-components/macro';
import ImageErrorUrl from '../../assets/images/error-valley.svg';
import LogoURL from '../../assets/logo/logo.png';
import useFluent from '../../hooks/useFluent';
import {ContentContainer} from '../../styling/Grid';

const Root = styled(ContentContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  pointer-events: all;
  width: 100%;
  grid-column: 1 / -1;
`;

const Image = styled.img`
  opacity: 0.75;
  max-width: 100%;
  width: 500px;
  margin-bottom: 1rem;
`;

const Logo = styled.img`
  width: 120px;
  margin: 2rem auto;
`;

const ErrorComponent = () => {
  const getString = useFluent();

  return (
    <Root>
      <Image src={ImageErrorUrl} />
      <h1>
        {getString('page-error-title')}
      </h1>
      <p>
        {getString('page-error-desc')}
      </p>
      <p>
        <small
          dangerouslySetInnerHTML={{__html: getString('page-error-contact')}}
        />
      </p>
      <a href='/'>
        <Logo src={LogoURL} />
      </a>
    </Root>
  );
};

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    captureException(error);
    console.error({error, errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorComponent />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
