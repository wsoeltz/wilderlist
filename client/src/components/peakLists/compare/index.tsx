import React from 'react';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
} from '../../../styling/Grid';
import BackButton from '../../sharedComponents/BackButton';
import CompareAllMountains from './CompareAllMountains';
import PeakListComparison from './PeakListComparison';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';

const ComparePeakListPage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const { id: profileId, peakListId }: any = useParams();

  let comparison: React.ReactElement<any> | null;
  if (!peakListId) {
    comparison = null;
  } else if (peakListId === 'all' && userId !== null) {
    comparison = <CompareAllMountains userId={userId} id={profileId} />;
  } else if (userId !== null) {
    comparison = (
      <PeakListComparison
        key={peakListId}
        userId={userId}
        friendId={profileId}
        peakListId={peakListId}
      />
    );
  } else {
    comparison = null;
  }

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          {comparison}
        </ContentBody>
      </ContentLeftLarge>
    </>
  );
};

export default ComparePeakListPage;
