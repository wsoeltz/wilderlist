import React, {useContext} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentHeader,
  ContentLeftLarge,
} from '../../../styling/Grid';
import BackButton from '../../sharedComponents/BackButton';
import MountainForm, {StateDatum} from './MountainForm';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import LoadingSpinner from '../../sharedComponents/LoadingSpinner';
import { PlaceholderText } from '../../../styling/styleUtils';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { GetString } from 'fluent-react';

const GET_STATES = gql`
  query getStates {
  states {
    id
    name
    abbreviation
  }
}
`;

interface SuccessResponse {
  states: null | Array<StateDatum>;
}

interface Props extends RouteComponentProps {
  userId: string | null;
}

const MountainCreatePage = (props: Props) => {
  const { userId, match } = props;
  const { id }: any = match.params;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const {loading, error, data} = useQuery<SuccessResponse>(GET_STATES);

  let mountainForm: React.ReactElement<any> | null;
  if (loading === true) {
    mountainForm = <LoadingSpinner />;
  } else if (error !== undefined) {
    console.error(error);
    mountainForm = (
      <PlaceholderText>
        {getFluentString('global-error-retrieving-data')}
      </PlaceholderText>
    );
  } else if (data !== undefined) {
    const states = data.states ? data.states : [];
    const initialMountain = {
      id: '',
      name: '',
      latitude: '',
      longitude: '',
      elevation: '',
      state: null,
    }
    mountainForm = (
      <MountainForm
        states={states}
        initialData={initialMountain}
      />
    );
  } else {
    mountainForm = null;
  }

  return (
    <>
      <ContentLeftLarge>
        <ContentHeader>
          <BackButton />
        </ContentHeader>
        <ContentBody>
          User ID: {userId}, Mountain ID: {id}
          {mountainForm}
        </ContentBody>
      </ContentLeftLarge>
    </>
  );
};

export default withRouter(MountainCreatePage);
