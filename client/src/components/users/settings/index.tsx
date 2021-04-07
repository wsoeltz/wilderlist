import React from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import PleaseLogin from '../../sharedComponents/PleaseLogin';
import SettingsPanel from './SettingsPanel';

const Settings = () => {
  const user = useCurrentUser();
  if (user) {
    return <SettingsPanel userId={user._id} />;
  } if (!user && user !== null) {
    return <PleaseLogin />;
  } else {
    return null;
  }
};

export default Settings;
