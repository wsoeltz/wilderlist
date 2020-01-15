import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
} from '../../../styling/Grid';
import BackButton from '../../sharedComponents/BackButton';
import MountainForm from './MountainForm';

interface Props extends RouteComponentProps {
  userId: string | null;
}

const MountainCreatePage = (props: Props) => {
  const { userId, match } = props;
  const { id }: any = match.params;

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          User ID: {userId}, Mountain ID: {id}
          <MountainForm />
        </ContentBody>
      </ContentLeftLarge>
    </>
  );
};

export default withRouter(MountainCreatePage);
