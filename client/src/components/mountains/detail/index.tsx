import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
} from '../../../styling/Grid';
import MountainDetail from './MountainDetail';

interface Props extends RouteComponentProps {
  userId: string;
}

const MountainDetailPage = (props: Props) => {
  const { userId, match } = props;
  const { id }: any = match.params;

  return (
    <>
      <ContentLeftLarge>
        <ContentBody>
          <MountainDetail userId={userId} id={id} />
        </ContentBody>
      </ContentLeftLarge>
    </>
  );
};

export default withRouter(MountainDetailPage);
