import React from 'react';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import PageNotFound from '../../sharedComponents/404';
import PleaseLogin from '../../sharedComponents/PleaseLogin';
import PeakListComparison from './PeakListComparison';

const ComparePeakListPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const { id: profileId, peakListId }: any = useParams();

  if (!user && user !== null) {
    return <PleaseLogin />;
  } else if (!peakListId) {
    return <PageNotFound />;
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
