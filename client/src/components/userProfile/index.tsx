import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  ContentBody,
  ContentLeftLarge,
} from '../../styling/Grid';
import { User, FriendStatus } from '../../types/graphQLTypes';
import Header from './Header';

const GET_USER = gql`
  query getUser($userId: ID!, $profileId: ID!) {
    user(id: $profileId) {
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
    me: user(id: $userId) {
      id
      friends {
        user {
          id
        }
        status
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
  me: {
    friends: {
      user: {
        id: User['id'];
      }
      status: FriendStatus;
    }[]
  }
}

interface QueryVariables {
  userId: string;
  profileId: string;
}

interface Props extends RouteComponentProps {
  userId: string;
}

const UserProfile = (props: Props) => {
  const { match, userId } = props;
  const { id }: any = match.params;

  const {loading, error, data} = useQuery<QuerySuccessResponse, QueryVariables>(GET_USER, {
    variables: { profileId: id, userId },
  });

  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return null;
  } else if (data !== undefined) {
    const { user, me } = data;
    const friendsList = me.friends;
    let friendStatus: FriendStatus | null;
    if (friendsList !== null && friendsList.length !== 0) {
      const friendData = friendsList.find(
        (friend) => friend.user.id === user.id);
      if (friendData !== undefined) {
        friendStatus = friendData.status;
      } else {
        friendStatus = null;
      }
    } else {
      friendStatus = null;
    }
    return (
      <>
        <ContentLeftLarge>
          <ContentBody>
            <Header
              user={user}
              currentUserId={userId}
              friendStatus={friendStatus}
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
