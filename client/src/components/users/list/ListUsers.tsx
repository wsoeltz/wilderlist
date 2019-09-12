import React from 'react';
import { FriendStatus, User } from '../../../types/graphQLTypes';
import UserCard from './UserCard';
import { NoResults } from '../../../styling/styleUtils';

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  profilePictureUrl: User['profilePictureUrl'];
}

export interface FriendDatum {
  user: {
    id: User['id'],
  };
  status: FriendStatus;
}

interface Props {
  userData: UserDatum[];
  currentUserId: string;
  friendsList: FriendDatum[];
  showCurrentUser: boolean;
  noResultsText: string;
}

const ListUsers = (props: Props) => {
  const { userData, currentUserId, showCurrentUser, friendsList, noResultsText } = props;

  if (userData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const users = userData.map(user => {
    if (showCurrentUser === false && currentUserId === user.id) {
      return null;
    } else {
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
        <UserCard
          user={user}
          friendStatus={friendStatus}
          currentUserId={currentUserId}
          key={user.id}
        />
      );
    }
  });
  return (
    <>
      {users}
    </>
  );
};

export default ListUsers;
