import { useMutation } from '@apollo/react-hooks';
import { GetString } from 'fluent-react';
import gql from 'graphql-tag';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {
  AppLocalizationAndBundleContext,
} from '../../../contextProviders/getFluentLocalizationContext';
import { comparePeakListLink, friendsWithUserProfileLink, preventNavigation } from '../../../routing/Utils';
import {
  ButtonPrimary,
  Card,
  GhostButton,
  lightBaseColor,
} from '../../../styling/styleUtils';
import { FriendStatus, User } from '../../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../../Utils';
import { formatDate, getLatestOverallAscent } from '../../peakLists/Utils';
import DynamicLink from '../../sharedComponents/DynamicLink';
import { UserDatum } from './ListUsers';

export const SEND_FRIEND_REQUEST = gql`
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

export const ACCEPT_FRIEND_REQUEST = gql`
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

export const REMOVE_FRIEND = gql`
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

export interface FriendRequestVariables {
  userId: string;
  friendId: string;
}

export interface FriendRequestSuccessResponse {
  id: User['id'];
  friends: Array<{
    user: {
      id: User['id'];
      friends: Array<{
        user: {
          id: User['id'];
        }
        status: FriendStatus;
      }>;
    },
    status: FriendStatus;
  }>;
}

const LinkWrapper = styled(DynamicLink)`
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
  grid-template-columns: 6rem 1fr;
  grid-template-rows: 1fr auto;
  grid-column-gap: 1.1rem;
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 0.4rem;
`;
const TextContainer = styled.div`
  grid-row: 1;
  grid-column: 2;
`;

const ProfilePicture = styled.img`
  grid-row: 1 / span 2;
  grid-column: 1;
  max-width: 100%;
  margin-right: 1.5rem;
  border-radius: 4000px;
`;

const Subtitle = styled.p`
  color: ${lightBaseColor};
  margin: 0.4rem 0;
`;

const ButtonContainer = styled.div`
  grid-column: 2
  grid-row: 2;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const DeclineButton = styled(GhostButton)`
  margin-right: 0.6rem;
`;

interface Props {
  user: UserDatum;
  friendStatus: FriendStatus | null;
  currentUserId: string;
}

const UserCard = (props: Props) => {
  const { user, friendStatus, currentUserId } = props;

  const {localization} = useContext(AppLocalizationAndBundleContext);
  const getFluentString: GetString = (...args) => localization.getString(...args);

  const [sendFriendRequestMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(SEND_FRIEND_REQUEST);
  const [acceptFriendRequestMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(ACCEPT_FRIEND_REQUEST);
  const [removeFriendMutation] =
    useMutation<FriendRequestSuccessResponse, FriendRequestVariables>(REMOVE_FRIEND);

  const sendFriendRequest = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    sendFriendRequestMutation({
      variables: {userId: currentUserId, friendId: user.id}});
  };
  const acceptFriendRequest = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    acceptFriendRequestMutation({variables: {userId: currentUserId, friendId: user.id}});
  };
  const removeFriend = (e: React.SyntheticEvent) => {
    preventNavigation(e);
    removeFriendMutation({variables: {userId: currentUserId, friendId: user.id}});
  };

  let cardContent: React.ReactElement<any> | null;
  if (friendStatus === null) {
    cardContent = (
      <>
        <TextContainer>
          <Title>
            {user.name}
          </Title>
        </TextContainer>
        <ButtonContainer>
          <ButtonPrimary onClick={sendFriendRequest}>
            {getFluentString('user-profile-requests-add-friend')}
          </ButtonPrimary>
        </ButtonContainer>
      </>
    );
  } else if (friendStatus === FriendStatus.friends) {
    const { mountains } = user;
    let ascentText: string;
    if (mountains !== null) {
      const latestAscent = getLatestOverallAscent(mountains);
      if (latestAscent !== null) {
        ascentText = getFluentString('user-profile-latest-ascents', {
          'mountain-name': latestAscent.name,
          'date': formatDate(latestAscent.date),
        });
      } else {
        ascentText = getFluentString('user-profile-no-recent-ascents');
      }
    } else {
      ascentText = getFluentString('user-profile-no-recent-ascents');
    }
    cardContent = (
      <>
        <TextContainer>
          <Title>
            {user.name}
          </Title>
          <Subtitle>
            {ascentText}
          </Subtitle>
        </TextContainer>
      </>
    );
  } else if (friendStatus === FriendStatus.sent) {
    cardContent = (
      <>
        <TextContainer>
          <Title>
            {user.name}
          </Title>
          <Subtitle>
            {getFluentString('user-profile-requests-pending-request')}
          </Subtitle>
        </TextContainer>
        <ButtonContainer>
          <GhostButton onClick={removeFriend}>
            {getFluentString('user-profile-requests-cancel-request')}
          </GhostButton>
        </ButtonContainer>
      </>
    );
  } else if (friendStatus === FriendStatus.recieved) {
    cardContent = (
      <>
        <TextContainer>
          <Title>
            {user.name}
          </Title>
        </TextContainer>
        <ButtonContainer>
          <DeclineButton onClick={removeFriend}>
            {getFluentString('user-profile-requests-decline-request')}
          </DeclineButton>
          <ButtonPrimary onClick={acceptFriendRequest}>
            {getFluentString('user-profile-requests-accept-request')}
          </ButtonPrimary>
        </ButtonContainer>
      </>
    );
  } else {
    failIfValidOrNonExhaustive(friendStatus, 'Invalid value for friendStatus ' + friendStatus);
    cardContent = null;
  }

  const opacity = friendStatus === FriendStatus.friends ? 1 : 0.2;

  return (
    <LinkWrapper
      mobileURL={comparePeakListLink(user.id, 'none')}
      desktopURL={friendsWithUserProfileLink(user.id)}
    >
      <Root>
        <ProfilePicture
          src={user.profilePictureUrl}
          style={{opacity}}
        />
        {cardContent}
      </Root>
    </LinkWrapper>
  );
};

export default UserCard;
