import { GetString } from 'fluent-react';
import raw from 'raw.macro';
import React, {useContext} from 'react';
import styled from 'styled-components';
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

const LoginButton = styled(LoginWithGoogleButton)`
  margin: 40px auto;
  max-width: 200px;
  max-height: 50px;
  border: 1px solid ${lightBorderColor};
`;

interface Props {
  onCancel: () => void;
}

const SignUpModal = (props: Props) => {
  const { onCancel } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  return (
    <Modal
      onClose={onCancel}
      width={'500px'}
      height={'auto'}
    >
      <Root>
        <h3>{getFluentString('global-text-value-modal-sign-up-today')}</h3>
        <LoginButton href='/auth/google'
          dangerouslySetInnerHTML={{
            __html: raw('../../assets/images/google-signin-button/btn_google_light_normal_ios.svg'),
            }}
            title={getFluentString('header-text-login-with-google')}
        />
        <GhostButton onClick={onCancel}>
          {getFluentString('global-text-value-modal-close')}
        </GhostButton>
      </Root>
    </Modal>
  );
};

export default SignUpModal;
