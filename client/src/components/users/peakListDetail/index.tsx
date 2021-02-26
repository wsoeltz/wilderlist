import React from 'react';
import {useParams} from 'react-router-dom';
import PeakListDetail from '../../peakLists/detail/PeakListDetail';

const UserProfilePage = () => {
  const {peakListId }: any = useParams();

  return <PeakListDetail id={peakListId} />;
};

export default UserProfilePage;
