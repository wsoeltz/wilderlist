import React from 'react';
import { NoResults } from '../../../styling/styleUtils';
import { FriendStatus, Mountain, PeakList, User } from '../../../types/graphQLTypes';
import UserCard from './UserCard';

interface BasicMountainDatum {
  id: Mountain['id'];
  name: Mountain['name'];
}

export interface UserDatum {
  id: User['id'];
  name: User['name'];
  profilePictureUrl: User['profilePictureUrl'];
  peakLists: Array<{
    id: PeakList['id'];
    shortName: PeakList['shortName'];
    type: PeakList['type'];
    mountains: BasicMountainDatum[];
    parent: {
      id: PeakList['id'];
      mountains: BasicMountainDatum[];
    } | null;
  }>;
  mountains: User['mountains'];
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
  openInSidebar: boolean;
  sortByStatus: boolean;
}

const ListUsers = (props: Props) => {
  const {
    userData, currentUserId, showCurrentUser, friendsList, noResultsText,
    openInSidebar, sortByStatus,
  } = props;

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
          openInSidebar={openInSidebar}
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
  return (
    <>
      {usersAwaitingYourResponse}
      {users}
      {usersAwaitingTheirRespone}
    </>
  );
};

export default ListUsers;
