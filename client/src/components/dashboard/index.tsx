import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import SavedLists from './SavedLists';

const Dashboard = () => {
  const user = useCurrentUser();

  if (!user) {
    return null;
  } else {
    return (
      <SavedLists userId={user._id} />
    );
  }
};

export default Dashboard;
