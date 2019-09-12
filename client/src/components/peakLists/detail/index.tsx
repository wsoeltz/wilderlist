import React, { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../../styling/Grid';
import {
  PlaceholderText,
} from '../../../styling/styleUtils';
import MountainDetail from '../../mountains/detail/MountainDetail';
import PeakListDetail from './PeakListDetail';
import { GetString } from 'fluent-react';
import {
  AppLocalizationAndBundleContext
} from '../../../contextProviders/getFluentLocalizationContext';

interface Props extends RouteComponentProps {
  userId: string;
}

const PeakListDetailPage = (props: Props) => {
  const { userId, match } = props;
  const { id, mountainId }: any = match.params;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const mountainDetail = mountainId === undefined
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
        <ContentBody>
          <PeakListDetail userId={userId} id={id} />
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

export default withRouter(PeakListDetailPage);
