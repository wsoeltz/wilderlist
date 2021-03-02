import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  LinkButtonCompact,
} from '../../../styling/styleUtils';
import SignUpModal from '../../sharedComponents/SignUpModal';

const Root = styled(Link)`
  position: relative;
  font-size: 0.75rem;
`;

const SignUpButton = styled(LinkButtonCompact)`
  position: relative;
  font-size: 0.75rem;
  margin: auto;
`;

interface Props {
  to: string;
}

const LogTripButton = ({to}: Props) => {
  const user = useCurrentUser();
  const getString = useFluent();

  const [isSignUpModal, setIsSignUpModal] = useState<boolean>(false);

  const openSignUpModal = useCallback(() => setIsSignUpModal(true), [setIsSignUpModal]);
  const closeSignUpModal = useCallback(() => setIsSignUpModal(false), [setIsSignUpModal]);

  if (user) {
    return (
      <Root to={to}>
        <FontAwesomeIcon icon={faCalendarAlt} />
      </Root>
    );
  } else {
    const signUpModal = isSignUpModal === false ? null : (
      <SignUpModal
        text={getString('global-text-value-modal-sign-up-log-trips')}
        onCancel={closeSignUpModal}
      />
    );
    return (
      <>
        <SignUpButton onClick={openSignUpModal}>
          <FontAwesomeIcon icon={faCalendarAlt} />
        </SignUpButton>
        {signUpModal}
      </>
    );
  }

};

export default LogTripButton;
