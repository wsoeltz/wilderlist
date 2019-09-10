import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import CompareAllMountains from '../../peakLists/compare/CompareAllMountains';
import PeakListComparison from '../../peakLists/compare/PeakListComparison';
import UserProfile from './UserProfile';

interface Props extends RouteComponentProps {
  userId: string;
}

const UserProfilePage = (props: Props) => {
  const { match, history, userId } = props;
  const { id: profileId, peakListId }: any = match.params;

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

  return (
    <>
      <ContentLeftLarge>
        <ContentBody>
          <UserProfile
            userId={userId}
            id={profileId}
            history={history}
          />
        </ContentBody>
      </ContentLeftLarge>
      <ContentRightSmall>
        <ContentBody>
          {comparison}
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(UserProfilePage);
