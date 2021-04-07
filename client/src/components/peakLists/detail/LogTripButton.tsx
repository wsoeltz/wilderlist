import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  BasicIconInText,
  LinkButtonCompact,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import SignUpModal from '../../sharedComponents/SignUpModal';

const Root = styled(Link)`
  position: relative;
  font-size: 0.75rem;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const SignUpButton = styled(LinkButtonCompact)`
  position: relative;
  font-size: 0.75rem;
  margin: auto;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const LinkText = styled.span`
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 600;
`;

interface Props {
  to: string;
  type: PeakListVariants;
}

const LogTripButton = ({to, type}: Props) => {
  const user = useCurrentUser();
  const getString = useFluent();

  const [isSignUpModal, setIsSignUpModal] = useState<boolean>(false);

  const openSignUpModal = useCallback(() => setIsSignUpModal(true), [setIsSignUpModal]);
  const closeSignUpModal = useCallback(() => setIsSignUpModal(false), [setIsSignUpModal]);

  const content = type === PeakListVariants.standard || type === PeakListVariants.winter ? (
    <>
      <BasicIconInText icon={faCalendarAlt} />
      <LinkText>{getString('global-text-value-modal-mark-complete')}</LinkText>
    </>
  ) : <FontAwesomeIcon icon={faCalendarAlt} />;

  if (user) {
    return <Root to={to}>{content}</Root>;
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
          {content}
        </SignUpButton>
        {signUpModal}
      </>
    );
  }

};

export default LogTripButton;
