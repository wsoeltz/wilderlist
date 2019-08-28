import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import axios from 'axios';
import 'normalize.css';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Routes } from '../routing/routes';
import '../styling/fonts/fonts.css';
import GlobalStyles from '../styling/GlobalStyles';
import { Root } from '../styling/Grid';
import { PermissionTypes, User } from '../types/graphQLTypes';
import AdminPanel from './adminPanel';
import AdminMountains from './adminPanel/AdminMountains';
import AdminPeakLists from './adminPanel/AdminPeakLists';
import AdminRegions from './adminPanel/AdminRegions';
import AdminStates from './adminPanel/AdminStates';
import AdminUsers from './adminPanel/AdminUsers';
import PeakListPage from './peakLists';
import Header from './sharedComponents/Header';

const client = new ApolloClient();
export const UserContext = React.createContext<User | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<User| null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/current_user');
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const userRoutes = (user) ? (
    <>
      <Route exact path={Routes.Lists}
        render={(props) => <PeakListPage {...props} userId={user._id} />}
      />
    </>
  ) : null;

  const adminRoutes = (user && user.permissions === PermissionTypes.admin) ? (
      <>
        <Route path={Routes.Admin} component={AdminPanel} />
        <Route exact path={Routes.AdminStates} component={AdminStates} />
        <Route exact path={Routes.AdminPeakLists} component={AdminPeakLists} />
        <Route exact path={Routes.AdminMountains} component={AdminMountains} />
        <Route exact path={Routes.AdminRegions} component={AdminRegions} />
        <Route exact path={Routes.AdminUsers} component={AdminUsers} />
      </>
    ) : null;

  return (
    <UserContext.Provider value={user}>
      <ApolloProvider client={client}>
        <GlobalStyles />
        <Router>
          <Root>
            <Header />
            {adminRoutes}
            {userRoutes}
          </Root>
        </Router>
      </ApolloProvider>
    </UserContext.Provider>
  );
};

export default App;
