import { GetString } from 'fluent-react';
import { Types } from 'mongoose';
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
import PeakListDetail from './PeakListDetail';

interface Props extends RouteComponentProps {
  userId: string | null;
}

const PeakListDetailPage = (props: Props) => {
  const { userId, match } = props;
  const { id, mountainId, friendId, peakListId }: any = match.params;

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
  const peakListUser = Types.ObjectId.isValid(friendId) ? friendId : userId;
  const listId = Types.ObjectId.isValid(peakListId) ? peakListId : id;

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          <PeakListDetail userId={peakListUser} id={listId} mountainId={mountainId} setOwnMetaData={true} />
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
