import React from 'react';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import PeakListDetail from '../../peakLists/detail/PeakListDetail';

const UserProfilePage = () => {
  const user = useCurrentUser();
  const { id, peakListId }: any = useParams();

  const profileId = user ? id : null;

  return <PeakListDetail userId={profileId} id={peakListId} />;
};

export default UserProfilePage;
