import { GetString } from 'fluent-react';
import raw from 'raw.macro';
import React, {useContext} from 'react';
import styled from 'styled-components/macro';
import {
  AppLocalizationAndBundleContext,
} from '../../contextProviders/getFluentLocalizationContext';
import {
  GhostButton,
  lightBorderColor,
} from '../../styling/styleUtils';
import Modal from './Modal';
import { LoginWithGoogleButton } from './UserMenu';

const Root = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  line-height: 1.3;
`;

const LoginButton = styled(LoginWithGoogleButton)`
  margin: 40px auto;
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
        <LoginButton href='/auth/google'
          dangerouslySetInnerHTML={{
            __html: raw('../../assets/images/google-signin-button/btn_google_light_normal_ios.svg'),
            }}
            title={getFluentString('header-text-login-with-google')}
        />
      </Root>
    </Modal>
  );
};

export default SignUpModal;
