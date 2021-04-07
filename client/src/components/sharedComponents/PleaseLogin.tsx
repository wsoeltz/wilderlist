import React from 'react';
import styled from 'styled-components/macro';
import Image404Url from '../../assets/images/gated-page.svg';
import useFluent from '../../hooks/useFluent';
import {ContentContainer} from '../../styling/Grid';
import {StackedLoginButtons} from './SignUpModal';

const Root = styled(ContentContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  pointer-events: all;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Image = styled.img`
  opacity: 0.75;
  max-width: 100%;
  width: 500px;
  margin-bottom: 1rem;
`;

const PleaseLogin = () => {
  const getString = useFluent();

  return (
    <Root>
      <Image src={Image404Url} />
      <h1>
        {getString('please-login-title')}
      </h1>
      <ButtonContainer>
        <StackedLoginButtons />
      </ButtonContainer>
      <p>
        <small
          dangerouslySetInnerHTML={{__html: getString('please-login-contact')}}
        />
      </p>
    </Root>
    );
};

export default PleaseLogin;
