import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentFull,
  ContentHeader,
} from '../../../styling/Grid';
import BackButton from '../../sharedComponents/BackButton';
import MountainDetail from './MountainDetail';

interface Props extends RouteComponentProps {
  userId: string | null;
}

const MountainDetailPage = (props: Props) => {
  const { userId, match } = props;
  const { id, mountainId: possibleMountainId }: any = match.params;
  const mountainId = possibleMountainId ? possibleMountainId : id;
  const peakListId = possibleMountainId ? id : null;

  return (
    <>
      <ContentFull>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          <MountainDetail userId={userId} id={mountainId} peakListId={peakListId} setOwnMetaData={true} />
        </ContentBody>
      </ContentFull>
    </>
  );
};

export default withRouter(MountainDetailPage);
