import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useCallback, useState} from 'react';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import useFluent from '../../../../hooks/useFluent';
import {refetchUsersLists} from '../../../../queries/getUsersPeakLists';
import { PeakListVariants } from '../../../../types/graphQLTypes';
import {mobileSize} from '../../../../Utils';
import NewAscentReport from '../../../peakLists/detail/completionModal/NewAscentReport';
import {
  FloatingButton,
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

  const [ascentModalOpen, setAscentModalOpen] = useState<boolean>(false);
  const openAscentModal = useCallback(() => setAscentModalOpen(true), []);
  const closeAscentModal = useCallback(() => setAscentModalOpen(false), []);

  if (user) {
    const userId = user._id;

    const addAscentModal = ascentModalOpen ? (
      <NewAscentReport
        initialMountainList={[]}
        closeEditMountainModalModal={closeAscentModal}
        userId={userId}
        variant={PeakListVariants.standard}
        queryRefetchArray={[refetchUsersLists({userId})]}
      />
    ) : null;

    return (
      <>
        <FloatingButton onClick={openAscentModal}>
          <IconContainer>
            <FontAwesomeIcon icon='calendar-alt' />
          </IconContainer>
          <TextContainer
            dangerouslySetInnerHTML={{__html: getString('global-add-trip-report')}}
          />
        </FloatingButton>
        {addAscentModal}
      </>
    );
  } else {
    return null;
  }

};

export default AddAscentButton;
