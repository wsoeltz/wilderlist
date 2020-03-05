import { GetString } from 'fluent-react/compat';
import { Types } from 'mongoose';
import React, {useContext} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import { PlaceholderText } from '../../../styling/styleUtils';
import MountainDetail from '../../mountains/detail/MountainDetail';
import PeakListDetail from '../../peakLists/detail/PeakListDetail';
import BackButton from '../../sharedComponents/BackButton';

interface Props extends RouteComponentProps {
  userId: string;
}

const UserProfilePage = (props: Props) => {
  const { match, userId } = props;
  const { id, peakListId, mountainId }: any = match.params;

  const profileId = id;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const mountainDetail = !Types.ObjectId.isValid(mountainId)
    ? (
        <PlaceholderText>
          {getFluentString('peak-list-detail-select-mountain')}
        </PlaceholderText>
      )
    : (
        <MountainDetail userId={userId} id={mountainId} />
      );

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          <PeakListDetail
            userId={profileId}
            id={peakListId}
            mountainId={undefined}
          />
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

export default withRouter(UserProfilePage);
