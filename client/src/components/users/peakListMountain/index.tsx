import React from 'react';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
} from '../../../styling/Grid';
import PeakListDetail from '../../peakLists/detail/PeakListDetail';
import BackButton from '../../sharedComponents/BackButton';
import {useParams} from 'react-router-dom';

const UserProfilePage = () => {
  const { id, peakListId }: any = useParams();

  const profileId = id;

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
