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
  const { id }: any = match.params;

  return (
    <>
      <ContentFull>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          <MountainDetail userId={userId} id={id} setOwnMetaData={true} />
        </ContentBody>
      </ContentFull>
    </>
  );
};

export default withRouter(MountainDetailPage);
