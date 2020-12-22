import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useCallback, useContext, useState} from 'react';
import styled from 'styled-components/macro';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import {
  ButtonSecondary,
} from '../../../styling/styleUtils';
import { PeakListVariants } from '../../../types/graphQLTypes';
import { mobileSize } from '../../../Utils';
import {AppContext} from '../../App';
import {GET_USERS_PEAK_LISTS} from '../../dashboard/SavedLists';
import NewAscentReport from '../../peakLists/detail/completionModal/NewAscentReport';

const AscentButtonRoot = styled.div`
  display: flex;
  align-items: center;
`;

const AddAscentButton = () => {
  const { windowWidth } = useContext(AppContext);
  const user = useCurrentUser();
  const getString = useFluent();

  const [ascentModalOpen, setAscentModalOpen] = useState<boolean>(false);
  const openAscentModal = useCallback(() => setAscentModalOpen(true), []);
  const closeAscentModal = useCallback(() => setAscentModalOpen(false), []);

  if (user) {
    const userId = user._id;
    const addAscentButton = windowWidth < mobileSize ? (
      <AscentButtonRoot>
        <ButtonSecondary onClick={openAscentModal}>
          <FontAwesomeIcon icon='calendar-alt' /> {getString('global-add-trip-report')}
        </ButtonSecondary>
      </AscentButtonRoot>
    ) : null;

    const addAscentModal = ascentModalOpen ? (
      <NewAscentReport
        initialMountainList={[]}
        closeEditMountainModalModal={closeAscentModal}
        userId={userId}
        variant={PeakListVariants.standard}
        queryRefetchArray={[{query: GET_USERS_PEAK_LISTS, variables: { userId }}]}
      />
    ) : null;

    return (
      <>
        {addAscentButton}
        {addAscentModal}
      </>
    );
  } else {
    return null;
  }

};

export default AddAscentButton;
