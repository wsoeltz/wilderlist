import sortBy from 'lodash/sortBy';
import React from 'react';
import { FriendDatum, UserDatum } from '../../../queries/users/useUserSearch';
import { NoResults, PlaceholderText } from '../../../styling/styleUtils';
import { FriendStatus } from '../../../types/graphQLTypes';
import UserCard from './UserCard';

interface Props {
  userData: UserDatum[] | null;
  currentUserId: string;
  friendsList: FriendDatum[];
  showCurrentUser: boolean;
  noResultsText: string;
  noFriendsText: string;
  sortByStatus: boolean;
}

const ListUsers = (props: Props) => {
  const {
    userData, currentUserId, showCurrentUser, friendsList, noResultsText,
    sortByStatus, noFriendsText,
  } = props;

  if (userData === null) {
    return (
      <>
        <br />
        <PlaceholderText dangerouslySetInnerHTML={{__html: noFriendsText}} />
      </>
    );
  }
  if (userData.length === 0) {
    return <NoResults dangerouslySetInnerHTML={{__html: noResultsText}} />;
  }
  const usersAwaitingYourResponse: Array<React.ReactElement<any>> = [];
  const usersAwaitingTheirRespone: Array<React.ReactElement<any>> = [];
  const users = sortBy(userData, ['name']).map(user => {
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
    <div>
      {usersAwaitingYourResponse}
      {users}
      {usersAwaitingTheirRespone}
    </div>
  );
};

export default ListUsers;
