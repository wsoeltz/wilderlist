import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ButtonPrimary,
  ButtonSecondary,
  Card,
} from '../../styling/styleUtils';
import { FriendStatus } from '../../types/graphQLTypes';
import { failIfValidOrNonExhaustive } from '../../Utils';
import { UserDatum } from './ListUsers';

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
}

const UserCard = (props: Props) => {
  const { user, friendStatus } = props;
  let actionButtons: React.ReactElement<any> | null;

  const preventNavigation = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  if (friendStatus === null) {
    const onClick = (e: React.SyntheticEvent) => {
      preventNavigation(e);
    };
    actionButtons = (
      <ButtonPrimary onClick={onClick}>Add Friend</ButtonPrimary>
    );
  } else if (friendStatus === FriendStatus.friends) {
    const onClick = (e: React.SyntheticEvent) => {
      preventNavigation(e);
    };
    actionButtons = (
      <ButtonSecondary onClick={onClick}>Remove Friend</ButtonSecondary>
    );
  } else if (friendStatus === FriendStatus.sent) {
    const onClick = (e: React.SyntheticEvent) => {
      preventNavigation(e);
    };
    actionButtons = (
      <p>
        Pending friend request
        <ButtonSecondary onClick={onClick}>Cancel Request</ButtonSecondary>
      </p>
    );
  } else if (friendStatus === FriendStatus.recieved) {
    const onClick = (e: React.SyntheticEvent) => {
      preventNavigation(e);
    };
    actionButtons = (
      <p>
        <ButtonSecondary onClick={onClick}>Decline Friend Request</ButtonSecondary>
        <ButtonPrimary onClick={onClick}>Accept Friend Request</ButtonPrimary>
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
