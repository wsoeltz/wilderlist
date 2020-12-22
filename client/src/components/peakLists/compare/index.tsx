import React from 'react';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import CompareAllMountains from './CompareAllMountains';
import PeakListComparison from './PeakListComparison';

const ComparePeakListPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const { id: profileId, peakListId }: any = useParams();

  if (!peakListId) {
    return null;
  } else if (peakListId === 'all' && userId !== null) {
    return <CompareAllMountains userId={userId} id={profileId} />;
  } else if (userId !== null) {
    return (
      <PeakListComparison
        key={peakListId}
        userId={userId}
        friendId={profileId}
        peakListId={peakListId}
      />
    );
  } else {
    return null;
  }
};

export default ComparePeakListPage;
