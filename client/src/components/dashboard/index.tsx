import React from 'react';
import useCurrentUser from '../../hooks/useCurrentUser';
import PleaseLogin from '../sharedComponents/PleaseLogin';
import Dashboard from './Dashboard';

const DashboardWrapper = () => {
  const user = useCurrentUser();

  if (!user && user !== null) {
    return <PleaseLogin />;
  } else if (user) {
    return (
      <Dashboard userId={user._id} />
    );
  } else {
    return null;
  }
};

export default DashboardWrapper;
