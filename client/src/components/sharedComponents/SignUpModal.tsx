import {
  faGoogle,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import { GetString } from 'fluent-react';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  GhostButton,
  lightBorderColor,
} from '../../styling/styleUtils';
import {
  BrandIcon,
  googleBlue,
  LoginButtonBase,
  LoginText,
  redditRed,
} from '../login';
import Modal from './Modal';

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
