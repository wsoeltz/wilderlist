import React from 'react';
import { FriendStatus, User } from '../../../types/graphQLTypes';
import UserCard from './UserCard';

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
}

const ListUsers = (props: Props) => {
  const { userData, currentUserId, showCurrentUser, friendsList } = props;

  if (userData.length === 0) {
    return <>No users found</>;
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
