import React from 'react';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
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
    return <MountainDetail userId={userId} id={mountainId} setOwnMetaData={true} />;
  }
};

export default MountainDetailPage;
