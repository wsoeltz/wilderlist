import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import MountainDetail from '../../mountains/detail/MountainDetail';
import CompareAllMountains from './CompareAllMountains';
import PeakListComparison from './PeakListComparison';
import { GetString } from 'fluent-react';
import {
  AppLocalizationAndBundleContext
} from '../../../contextProviders/getFluentLocalizationContext';

interface Props extends RouteComponentProps {
  userId: string;
}

const ComparePeakListPage = (props: Props) => {
  const { userId, match } = props;
  const { id: profileId, peakListId, mountainId }: any = match.params;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

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
        <h2>
          {getFluentString('list-detail-mountain-detail-placeholder')}
        </h2>
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
