import React from 'react';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import {
  ContentBody,
  ContentContainer,
} from '../../../styling/Grid';
import MountainList from '../list';
import MountainDetail from './MountainDetail';

const MountainDetailPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const { id, mountainId: possibleMountainId }: any = useParams();
  const mountainId = possibleMountainId ? possibleMountainId : id;

  if (mountainId === 'search') {
    return <MountainList />;
  } else {
    return (
      <>
        <ContentContainer>
          <ContentBody>
            <MountainDetail userId={userId} id={mountainId} setOwnMetaData={true} />
          </ContentBody>
        </ContentContainer>
      </>
    );
  }
};

export default MountainDetailPage;
