import React from 'react';
import {useParams} from 'react-router-dom';
import MountainList from '../list';
import MountainDetail from './MountainDetail';

const MountainDetailPage = () => {
  const { id, mountainId: possibleMountainId }: any = useParams();
  const mountainId = possibleMountainId ? possibleMountainId : id;

  if (mountainId === 'search') {
    return <MountainList />;
  } else {
    return <MountainDetail id={mountainId} />;
  }
};

export default MountainDetailPage;
