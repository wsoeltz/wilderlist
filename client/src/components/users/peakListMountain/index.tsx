import { Types } from 'mongoose';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import useFluent from '../../../hooks/useFluent';
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
  const getString = useFluent();

  const mountainDetail = !Types.ObjectId.isValid(mountainId)
    ? (
        <PlaceholderText>
          {getString('peak-list-detail-select-mountain')}
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
