import React from 'react';
import { User } from '../../types/graphQLTypes';
import UserCard from './UserCard';

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  profilePictureUrl: User['profilePictureUrl'];
}

interface Props {
  userData: UserDatum[];
  currentUserId: string;
  showCurrentUser: boolean;
}

const ListPeakLists = (props: Props) => {
  const { userData, currentUserId, showCurrentUser } = props;

  if (userData.length === 0) {
    return <>No users found</>;
  }
  const peakLists = userData.map(user => {
    if (showCurrentUser === false && currentUserId === user.id) {
      return null;
    } else {
      return (
        <UserCard
          user={user}
          key={user.id}
        />
      );
    }
  });
  return (
    <>
      {peakLists}
    </>
  );
};

export default ListPeakLists;
