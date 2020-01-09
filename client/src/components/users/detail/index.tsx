import { GetString } from 'fluent-react';
import { Types } from 'mongoose';
import React, {useContext} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { Routes } from '../../../routing/routes';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import { PlaceholderText } from '../../../styling/styleUtils';
import CompareAllMountains from '../../peakLists/compare/CompareAllMountains';
import PeakListComparison from '../../peakLists/compare/PeakListComparison';
import PeakListDetail from '../../peakLists/detail/PeakListDetail';
import BackButton from '../../sharedComponents/BackButton';
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

  let peakListPanel: React.ReactElement<any> | null;
  if (id === userId) {
    if (!Types.ObjectId.isValid(peakListId)) {
      peakListPanel = <PlaceholderText>{getFluentString('list-search-list-detail-placeholder')}</PlaceholderText>;
    } else {
      peakListPanel = <PeakListDetail userId={userId} id={peakListId} mountainId={undefined} />;
    }
  } else {
    if (match.path === Routes.OtherUserPeakListCompare) {
      if (peakListId === 'all') {
        peakListPanel = <CompareAllMountains userId={userId} id={profileId} />;
      } else if (!Types.ObjectId.isValid(peakListId)) {
        peakListPanel = (
          <PlaceholderText>{getFluentString('user-profile-compare-ascents-placeholder')}</PlaceholderText>
        );
      } else {
        peakListPanel = (
          <PeakListComparison
            userId={userId}
            friendId={profileId}
            peakListId={peakListId}
          />
        );
      }
    } else if (match.path === Routes.OtherUserPeakList) {
      peakListPanel = (
        <PeakListDetail
          userId={profileId}
          id={peakListId}
          mountainId={undefined}
        />
      );
    } else {
      peakListPanel = null;
    }
  }

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
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
          {peakListPanel}
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(UserProfilePage);
