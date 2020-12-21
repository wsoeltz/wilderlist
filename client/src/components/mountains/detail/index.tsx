import React from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {
  ContentBody,
  ContentFull,
  ContentHeader,
} from '../../../styling/Grid';
import BackButton from '../../sharedComponents/BackButton';
import MountainDetail from './MountainDetail';
import {useParams} from 'react-router-dom';

const MountainDetailPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const { id, mountainId: possibleMountainId }: any = useParams();
  const mountainId = possibleMountainId ? possibleMountainId : id;

  return (
    <>
      <ContentFull>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          <MountainDetail userId={userId} id={mountainId} setOwnMetaData={true} />
        </ContentBody>
      </ContentFull>
    </>
  );
};

export default MountainDetailPage;
