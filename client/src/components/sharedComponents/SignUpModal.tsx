import {
  faFacebook,
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetString } from 'fluent-react/compat';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  GhostButton,
  lightBaseColor,
  lightBorderColor,
} from '../../styling/styleUtils';
import Modal from './Modal';

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

interface Props {
  text: string;
  onCancel: () => void;
}

const SignUpModal = (props: Props) => {
  const { text, onCancel } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const actions = (
    <GhostButton onClick={onCancel}>
      {getFluentString('global-text-value-modal-close')}
    </GhostButton>
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
        <LoginButton href='/auth/google'>
          <BrandIcon
            icon={faGoogle}
            style={{color: googleBlue}}
          />
          <LoginText>
            {getFluentString('header-text-login-with-google')}
          </LoginText>
        </LoginButton>
        <LoginButton href='/auth/facebook'>
          <BrandIcon
            icon={faFacebook}
            style={{color: facebookBlue}}
          />
          <LoginText>
            {getFluentString('header-text-login-with-facebook')}
          </LoginText>
        </LoginButton>
        <LoginButton href='/auth/reddit'>
          <BrandIcon
            icon={faReddit}
            style={{color: redditRed}}
          />
          <LoginText>
            {getFluentString('header-text-login-with-reddit')}
          </LoginText>
        </LoginButton>
      </Root>
    </Modal>
  );
};

export default SignUpModal;
