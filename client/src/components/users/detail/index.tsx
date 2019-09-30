import { GetString } from 'fluent-react';
import { Types } from 'mongoose';
import React, {useContext} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import { PlaceholderText } from '../../../styling/styleUtils';
import CompareAllMountains from '../../peakLists/compare/CompareAllMountains';
import PeakListComparison from '../../peakLists/compare/PeakListComparison';
import PeakListDetail from '../../peakLists/detail/PeakListDetail';
import UserProfile from './UserProfile';

interface Props extends RouteComponentProps {
  userId: string;
}

const UserProfilePage = (props: Props) => {
  const { match, history, userId } = props;
  const { id, peakListId }: any = match.params;

  const profileId = id === userId ? userId : id;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  let comparison: React.ReactElement<any> | null;
  if (id === userId) {
    if (!Types.ObjectId.isValid(peakListId)) {
      comparison = <PlaceholderText>{getFluentString('list-search-list-detail-placeholder')}</PlaceholderText>;
    } else {
      comparison = <PeakListDetail userId={userId} id={peakListId} />;
    }
  } else {
    if (peakListId === 'all') {
      comparison = <CompareAllMountains userId={userId} id={profileId} />;
    } else if (!Types.ObjectId.isValid(peakListId)) {
      comparison = <PlaceholderText>{getFluentString('user-profile-compare-ascents-placeholder')}</PlaceholderText>;
    } else {
      comparison = (
        <PeakListComparison
          userId={userId}
          friendId={profileId}
          peakListId={peakListId}
        />
      );
    }
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
