import { useMutation } from '@apollo/react-hooks';
import React from 'react';
import styled from 'styled-components';
import { preventNavigation } from '../../routing/Utils';
import {
  boldFontWeight,
  ButtonPrimary,
  ButtonSecondary,
  Label,
} from '../../styling/styleUtils';
import { FriendStatus } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import {
  ACCEPT_FRIEND_REQUEST,
  FriendRequestSuccessResponse,
  FriendRequestVariables,
  REMOVE_FRIEND,
  SEND_FRIEND_REQUEST,
} from '../users/UserCard';
import { UserDatum } from './index';

const Root = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 150px;
  grid-template-rows: auto auto auto;
`;

const TitleContent = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BeginRemoveListButtonContainer = styled.div`
  grid-column: 3;
  grid-row: 1;
  text-align: right;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const ListInfo = styled.h3`
  margin-bottom: 0.5rem;
  margin-top: 0;
`;

const ProfilePictureContainer = styled.div`
  grid-row: 2;
  grid-column: 1;
  padding-right: 2rem;
`;

const ProfilePicture = styled.img`
  max-width: 160px;
  border-radius: 4000px;
`;

const BoldLink = styled.a`
  font-weight: ${boldFontWeight};
`;

interface Props {
  user: UserDatum;
  friendStatus: FriendStatus | null;
  currentUserId: string;
}

const Header = (props: Props) => {
  const {
    user: { name, email, profilePictureUrl }, user,
    currentUserId, friendStatus,
  } = props;

  let actionButtons: React.ReactElement<any> | null;
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
  if (currentUserId === user.id) {
    actionButtons = null;
  } else if (friendStatus === null) {
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
    <Root>
      <TitleContent>
        <Title>{name}</Title>
        <ListInfo>
          <Label>Email:</Label> <BoldLink href={`mailto:${email}`}>{email}</BoldLink>
        </ListInfo>
      </TitleContent>
      <ProfilePictureContainer>
        <ProfilePicture alt={name} title={name} src={profilePictureUrl}/>
      </ProfilePictureContainer>
      <BeginRemoveListButtonContainer>
        {actionButtons}
        <ButtonPrimary>Compare All Ascents</ButtonPrimary>
      </BeginRemoveListButtonContainer>
    </Root>
  );
};

export default Header;
