import React from 'react';
import { NoResults } from '../../../styling/styleUtils';
import { FriendStatus, User } from '../../../types/graphQLTypes';
import UserCard from './UserCard';

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  profilePictureUrl: User['profilePictureUrl'];
  hideProfilePicture: User['hideProfilePicture'];
}

export interface FriendDatum {
  user: UserDatum;
  status: FriendStatus;
}

interface Props {
  userData: UserDatum[] | null;
  currentUserId: string;
  friendsList: FriendDatum[];
  showCurrentUser: boolean;
  noResultsText: string;
  noFriendsText: string;
  openInSidebar: boolean;
  sortByStatus: boolean;
}

const ListUsers = (props: Props) => {
  const {
    userData, currentUserId, showCurrentUser, friendsList, noResultsText,
    openInSidebar, sortByStatus, noFriendsText,
  } = props;

  if (userData === null) {
    return <NoResults dangerouslySetInnerHTML={{__html: noFriendsText}} />;
  }
  if (userData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const usersAwaitingYourResponse: Array<React.ReactElement<any>> = [];
  const usersAwaitingTheirRespone: Array<React.ReactElement<any>> = [];
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
      const userCard = (
        <UserCard
          user={user}
          friendStatus={friendStatus}
          currentUserId={currentUserId}
          key={user.id}
        />
      );
      if (friendStatus === FriendStatus.recieved && sortByStatus === true) {
        usersAwaitingYourResponse.push(userCard);
      } else if (friendStatus === FriendStatus.sent && sortByStatus === true) {
        usersAwaitingTheirRespone.push(userCard);
      } else {
        return userCard;
      }
      return null;
    }
  });
  if (userData.length === 1 && showCurrentUser === false && userData[0].id === currentUserId) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  return (
    <>
      {usersAwaitingYourResponse}
      {users}
      {usersAwaitingTheirRespone}
    </>
  );
};

export default ListUsers;
