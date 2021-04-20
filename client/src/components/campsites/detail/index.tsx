import React from 'react';
import {useParams} from 'react-router-dom';
import CampsiteList from '../list';
import CampsiteDetail from './CampsiteDetail';

const CampsiteDetailPage = () => {
  const { id, campsiteId: possibleCampsiteId }: any = useParams();
  const campsiteId = possibleCampsiteId ? possibleCampsiteId : id;

  if (campsiteId === 'search') {
    return <CampsiteList />;
  } else {
    return <CampsiteDetail id={campsiteId} />;
  }
};

export default CampsiteDetailPage;
