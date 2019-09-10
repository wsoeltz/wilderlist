import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import MountainDetail from '../../mountains/detail/MountainDetail';
import CompareAllMountains from './CompareAllMountains';
import PeakListComparison from './PeakListComparison';

interface Props extends RouteComponentProps {
  userId: string;
}

const ComparePeakListPage = (props: Props) => {
  const { userId, match } = props;
  const { id: profileId, peakListId, mountainId }: any = match.params;

  let comparison: React.ReactElement<any> | null;
  if (peakListId === undefined) {
    comparison = null;
  } else if (peakListId === 'all') {
    comparison = <CompareAllMountains userId={userId} id={profileId} />;
  } else {
    comparison = (
      <PeakListComparison
        userId={userId}
        friendId={profileId}
        peakListId={peakListId}
      />
    );
  }

  const mountainDetail = mountainId === undefined
    ? (
        <h2>Select a mountain to see more details</h2>
      )
    : (
        <MountainDetail userId={userId} id={mountainId} />
      );

  return (
    <>
      <ContentLeftLarge>
        <ContentBody>
          {comparison}
        </ContentBody>
      </ContentLeftLarge>
      <ContentRightSmall>
        <ContentBody>
          {mountainDetail}
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(ComparePeakListPage);
