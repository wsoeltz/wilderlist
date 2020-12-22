import React from 'react';
import {useParams} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import ListUsers from '../list';
import UserProfile from './UserProfile';

const UserProfilePage = () => {
  const user = useCurrentUser();
  const userId = user ? user._id : null;
  const { id }: any = useParams();

  const profileId = id === userId ? userId : id;

  if (profileId === 'search') {
    return <ListUsers />;
  } else if (userId) {
    return <UserProfile userId={userId} id={profileId} />;
  } else {
    return null;
  }

};

export default UserProfilePage;
