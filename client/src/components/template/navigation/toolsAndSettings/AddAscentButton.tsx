import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useState} from 'react';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {addTripReportLink} from '../../../../routing/Utils';
import {mobileSize} from '../../../../Utils';
import SignUpModal from '../../../sharedComponents/SignUpModal';
import {
  FloatingButton,
  FloatingLinkButton,
  IconContainer,
  TextContainer as TextContainerBase,
} from './Utils';

const TextContainer = styled(TextContainerBase)`
  @media(max-width: ${mobileSize}px) {
    text-transform: none;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0;
  }
`;

const AddAscentButton = () => {
  const user = useCurrentUser();
  const getString = useFluent();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  if (user) {
    return (
      <>
        <FloatingLinkButton to={addTripReportLink({})}>
          <IconContainer>
            <FontAwesomeIcon icon='calendar-alt' />
          </IconContainer>
          <TextContainer
            dangerouslySetInnerHTML={{__html: getString('global-add-trip-report')}}
          />
        </FloatingLinkButton>
      </>
    );
  } else {
    const signUp = modalOpen ? (
      <SignUpModal
        text={getString('global-text-value-modal-sign-up-log-trips')}
        onCancel={() => setModalOpen(false)}
      />
    ) : null;
    return (
      <>
        <FloatingButton onClick={() => setModalOpen(true)}>
          <IconContainer>
            <FontAwesomeIcon icon='calendar-alt' />
          </IconContainer>
          <TextContainer
            dangerouslySetInnerHTML={{__html: getString('global-add-trip-report')}}
          />
        </FloatingButton>
        {signUp}
      </>
    );
  }

};

export default AddAscentButton;
