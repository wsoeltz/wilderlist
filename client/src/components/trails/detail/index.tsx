import React from 'react';
import {useParams} from 'react-router-dom';
import TrailList from '../list';
import TrailDetail from './TrailDetail';

const TrailDetailPage = () => {
  const { id, trailId: possibleTrailId }: any = useParams();
  const trailId = possibleTrailId ? possibleTrailId : id;

  if (trailId === 'search') {
    return <TrailList />;
  } else {
    return <TrailDetail id={trailId} />;
  }
};

export default TrailDetailPage;
