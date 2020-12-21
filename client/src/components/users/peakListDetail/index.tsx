import React from 'react';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
} from '../../../styling/Grid';
import PeakListDetail from '../../peakLists/detail/PeakListDetail';
import BackButton from '../../sharedComponents/BackButton';

const UserProfilePage = () => {
  const user = useCurrentUser();
  const { id, peakListId }: any = useParams();

  const profileId = user ? id : null;

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          <PeakListDetail
            userId={profileId}
            id={peakListId}
          />
        </ContentBody>
      </ContentLeftLarge>
    </>
  );
};

export default UserProfilePage;
