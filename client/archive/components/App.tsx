import React from 'react';
import Core from './templates/core';
import GlobalStyles from '../styling/GlobalStyles';
import AppContext, {useWindowWidth} from '../contextProviders/appContext';
import UserContext, {useLoggedInUser} from '../contextProviders/userContext';

const App = () => {
  const windowDimensions = useWindowWidth();
  const user = useLoggedInUser();
  return (
    <UserContext.Provider value={user}>
      <AppContext.Provider value={{windowDimensions}}>
        <GlobalStyles />
        <Core />
      </AppContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
