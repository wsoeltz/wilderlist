import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faFacebook,
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import useFluent from '../../hooks/useFluent';
import {
  GhostButton,
  lightBaseColor,
  lightBorderColor,
} from '../../styling/styleUtils';
import Modal, {mobileWidth} from './Modal';

export const googleBlue = '#4285f4';
export const facebookBlue = '#1877F2';
export const redditRed = '#ff4500';

export const LoginButtonBase = styled.a`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin: auto 20px;
  max-height: 40px;
  min-width: 168px;
  max-width: 200px;
  text-decoration: none;
  border: 1px solid #efefef;
  color: ${lightBaseColor};

  &:hover {
    color: ${lightBaseColor};
    background-color: #efefef;
  }
`;

export const BrandIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  margin-left: 8px;
`;

export const LoginText = styled.span`
  font-size: 14px;
  padding: 8px;
`;

const Root = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  line-height: 1.3;
`;

const LoginButton = styled(LoginButtonBase)`
  margin: 10px auto;
  max-width: 200px;
  max-height: 50px;
  border: 1px solid ${lightBorderColor};
`;

const CloseButton = styled(GhostButton)`
  display: flex;
  margin-left: auto;

  @media (max-width: ${mobileWidth}px) {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    justify-content: center;
  }
`;

export const StackedLoginButtons = () => {
  const getString = useFluent();
  return (
    <>
      <LoginButton href='/auth/google'>
        <BrandIcon
          icon={faGoogle as IconDefinition}
          style={{color: googleBlue}}
        />
        <LoginText>
          {getString('header-text-login-with-google')}
        </LoginText>
      </LoginButton>
      <LoginButton href='/auth/facebook'>
        <BrandIcon
          icon={faFacebook as IconDefinition}
          style={{color: facebookBlue}}
        />
        <LoginText>
          {getString('header-text-login-with-facebook')}
        </LoginText>
      </LoginButton>
      <LoginButton href='/auth/reddit'>
        <BrandIcon
          icon={faReddit as IconDefinition}
          style={{color: redditRed}}
        />
        <LoginText>
          {getString('header-text-login-with-reddit')}
        </LoginText>
      </LoginButton>
    </>
  );
};

interface Props {
  text: string;
  onCancel: () => void;
}

const SignUpModal = (props: Props) => {
  const { text, onCancel } = props;

  const getString = useFluent();

  const actions = (
    <CloseButton onClick={onCancel}>
      {getString('global-text-value-modal-close')}
    </CloseButton>
  );

  return (
    <Modal
      onClose={onCancel}
      width={'400px'}
      height={'auto'}
      actions={actions}
    >
      <Root>
        <Title>{text}</Title>
        <StackedLoginButtons />
      </Root>
    </Modal>
  );
};

export default SignUpModal;
