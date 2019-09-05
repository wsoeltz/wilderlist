import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
} from '../../styling/Grid';
import { User } from '../../types/graphQLTypes';
import Header from './Header';

const GET_USER = gql`
  query getUser($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
      profilePictureUrl
      mountains {
        mountain {
          id
        }
        dates
      }
    }
  }
`;

export interface UserDatum {
  id: User['name'];
  name: User['name'];
  email: User['email'];
  profilePictureUrl: User['profilePictureUrl'];
  mountains: User['mountains'];
}

interface QuerySuccessResponse {
  user: UserDatum;
}

interface QueryVariables {
  userId: string;
}

interface Props extends RouteComponentProps {
  userId: string;
}

const UserProfile = (props: Props) => {
  const { match } = props;
  const { id }: any = match.params;

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_USER, {
    variables: { userId: id },
  });

  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const { user } = data;
    return (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <Header
              user={user}
            />
          </ContentBody>
        </ContentLeftLarge>
      </>
    );
  } else {
    return null;
  }
};

export default withRouter(UserProfile);
