import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import PageNotFound from '../sharedComponents/404';
import Dashboard from './Dashboard';

const DashboardWrapper = () => {
  const user = useCurrentUser();

  if (!user) {
    return <PageNotFound />;
  } else {
    return (
      <Dashboard userId={user._id} />
    );
  }
};

export default DashboardWrapper;
