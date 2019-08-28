import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
  ContentRightSmall,
} from '../../styling/Grid';

interface Props extends RouteComponentProps {
  userId: string;
}

const PeakListDetailPage = (props: Props) => {
  const { userId, match } = props;
  const { id }: any = match.params;
  return (
    <>
      <ContentLeftLarge>
        <ContentBody>
          <h1>Peak List {id}</h1>
          <h2>User {userId}</h2>
        </ContentBody>
      </ContentLeftLarge>
      <ContentRightSmall>
        <ContentBody>
          selected mountain content
        </ContentBody>
      </ContentRightSmall>
    </>
  );
};

export default withRouter(PeakListDetailPage);
