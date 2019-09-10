import React from 'react';
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

interface Props extends RouteComponentProps {
  userId: string;
}

const PeakListDetailPage = (props: Props) => {
  const { userId, match } = props;
  const { id, mountainId }: any = match.params;

  const mountainDetail = mountainId === undefined
    ? (
        <PlaceholderText>Select a mountain to see its details and your ascents</PlaceholderText>
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
