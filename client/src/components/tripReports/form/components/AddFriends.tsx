import React from 'react';
import {
  useGetFriendsBasic,
} from '../../../../queries/users/useGetFriendsBasic';
import FriendSelector from './FriendSelector';

interface Props {
  userId: string;
  emailList: string[];
  userList: string[];
  setEmailList: (emails: string[]) => void;
  setUserList: (users: string[]) => void;
}

const AddFriends = (props: Props) => {
  const {
    emailList, setEmailList, userList, setUserList,
    userId,
  } = props;

  const {loading, error, data} = useGetFriendsBasic(userId);

  if (loading === true) {
    return null;
  } else if (error !== undefined) {
    console.error(error);
    return  null;
  } else if (data !== undefined) {
    const { user } = data;
    if (!user) {
      return null;
    } else {
      const friends = user.friends ? user.friends : [];
      return (
        <FriendSelector
          friends={friends}
          userList={userList}
          emails={emailList}
          setUserList={setUserList}
          setEmails={setEmailList}
        />
      );
    }
  } else {
    return null;
  }

};

export default AddFriends;
