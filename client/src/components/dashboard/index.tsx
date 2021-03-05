import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import Dashboard from './Dashboard';

const DashboardWrapper = () => {
  const user = useCurrentUser();

  if (!user) {
    return null;
  } else {
    return (
      <Dashboard userId={user._id} />
    );
  }
};

export default DashboardWrapper;
