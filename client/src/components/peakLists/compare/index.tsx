import { GetString } from 'fluent-react/compat';
import React, { useContext } from 'react';
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
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import MountainDetail from '../../mountains/detail/MountainDetail';
import BackButton from '../../sharedComponents/BackButton';
import CompareAllMountains from './CompareAllMountains';
import PeakListComparison from './PeakListComparison';

interface Props extends RouteComponentProps {
  userId: string;
}

const ComparePeakListPage = (props: Props) => {
  const { userId, match } = props;
  const { id: profileId, peakListId, mountainId }: any = match.params;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);
  let comparison: React.ReactElement<any> | null;
  if (!peakListId) {
    comparison = null;
  } else if (peakListId === 'all') {
    comparison = <CompareAllMountains userId={userId} id={profileId} />;
  } else {
    comparison = (
      <PeakListComparison
        key={peakListId}
        userId={userId}
        friendId={profileId}
        peakListId={peakListId}
      />
    );
  }

  const mountainDetail = mountainId === undefined
    ? (
        <PlaceholderText>
          {getFluentString('list-detail-mountain-detail-placeholder')}
        </PlaceholderText>
      )
    : (
        <MountainDetail userId={userId} id={mountainId} peakListId={peakListId} />
      );

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
      <ContentRightSmall>
        <ContentBody>
          {mountainDetail}
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(ComparePeakListPage);
