import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonSecondary,
  Card,
} from '../../styling/styleUtils';
import { FriendStatus, User } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import { UserDatum } from './ListUsers';

const SEND_FRIEND_REQUEST = gql`
  mutation sendFriendRequest($userId: ID!, $friendId: ID!) {
  sendFriendRequest(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

const ACCEPT_FRIEND_REQUEST = gql`
  mutation acceptFriendRequest($userId: ID!, $friendId: ID!) {
  acceptFriendRequest(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

const REMOVE_FRIEND = gql`
  mutation removeFriend($userId: ID!, $friendId: ID!) {
  removeFriend(userId: $userId, friendId: $friendId) {
    id
    friends {
      status
      user {
        id
        friends {
          user {
            id
          }
          status
        }
      }
    }
  }
}
`;

interface FriendRequestVariables {
  userId: string;
  friendId: string;
}

interface FriendRequestSuccessResponse {
  id: User['id'];
  friends: Array<{
    user: {
      id: User['id'];
    },
  }>;
}

const LinkWrapper = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: inherit;
  grid-row: span 3;
  grid-column: span 2;

  &:hover {
    color: inherit;
  }
`;

const Root = styled(Card)`
  display: grid;
  grid-template-columns: auto 1fr;
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin-top: 0;
`;
const TextContainer = styled.div`
  grid-column: 2;
`;

const ProfilePicture = styled.img`
  grid-column: 1;
  max-width: 64px;
  margin-right: 1.5rem;
  border-radius: 4000px;
`;

interface Props {
  user: UserDatum;
  friendStatus: FriendStatus | null;
  currentUserId: string;
}

const UserCard = (props: Props) => {
  const { user, friendStatus, currentUserId } = props;
  let actionButtons: React.ReactElement<any> | null;

  const preventNavigation = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const [sendFriendRequestMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(SEND_FRIEND_REQUEST);
  const [acceptFriendRequestMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(ACCEPT_FRIEND_REQUEST);
  const [removeFriendMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(REMOVE_FRIEND);

  const sendFriendRequest = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    sendFriendRequestMutation({variables: {userId: currentUserId, friendId: user.id}});
  };
  const acceptFriendRequest = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    acceptFriendRequestMutation({variables: {userId: currentUserId, friendId: user.id}});
  };
  const removeFriend = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    removeFriendMutation({variables: {userId: currentUserId, friendId: user.id}});
  };

  if (friendStatus === null) {
    actionButtons = (
      <ButtonPrimary onClick={sendFriendRequest}>Add Friend</ButtonPrimary>
    );
  } else if (friendStatus === FriendStatus.friends) {
    actionButtons = (
      <ButtonSecondary onClick={removeFriend}>Remove Friend</ButtonSecondary>
    );
  } else if (friendStatus === FriendStatus.sent) {
    actionButtons = (
      <p>
        Pending friend request
        <ButtonSecondary onClick={removeFriend}>Cancel Request</ButtonSecondary>
      </p>
    );
  } else if (friendStatus === FriendStatus.recieved) {
    actionButtons = (
      <p>
        <ButtonSecondary onClick={removeFriend}>Decline Friend Request</ButtonSecondary>
        <ButtonPrimary onClick={acceptFriendRequest}>Accept Friend Request</ButtonPrimary>
      </p>
    );
  } else {
    failIfValidOrNonExhaustive(friendStatus, 'Invalid value for friendStatus ' + friendStatus);
    actionButtons = null;
  }
  return (
    <LinkWrapper to={'/'}>
      <Root>
        <ProfilePicture src={user.profilePictureUrl} />
        <TextContainer>
          <Title>
            {user.name}
          </Title>
          {actionButtons}
        </TextContainer>
      </Root>
    </LinkWrapper>
  );
};

export default UserCard;
