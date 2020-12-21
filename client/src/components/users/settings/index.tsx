import React from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
import SettingsPanel from './SettingsPanel';

const Settings = () => {
  const user = useCurrentUser();
  if (user) {
    return <SettingsPanel userId={user._id} />;
  } else {
    return null;
  }
};

export default Settings;
