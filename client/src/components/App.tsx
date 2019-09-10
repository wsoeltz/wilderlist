import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import axios from 'axios';
import debounce from 'lodash/debounce';
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
import { overlayPortalContainerId } from '../Utils';
import AdminPanel from './adminPanel';
import AdminMountains from './adminPanel/AdminMountains';
import AdminPeakLists from './adminPanel/AdminPeakLists';
import AdminRegions from './adminPanel/AdminRegions';
import AdminStates from './adminPanel/AdminStates';
import AdminUsers from './adminPanel/AdminUsers';
import MountainDetailPage from './mountains/detail';
import ComparePeakListPage from './peakLists/compare';
import PeakListDetailPage from './peakLists/detail';
import PeakListPage from './peakLists/list';
import Header from './sharedComponents/Header';
import UserProfile from './users/detail';
import ListUsersPage from './users/list';

export interface IAppContext {
  windowWidth: number;
}

const client = new ApolloClient();
export const UserContext = React.createContext<User | null>(null);
export const AppContext = React.createContext<IAppContext>({windowWidth: window.innerWidth});

const App: React.FC = () => {
  const [user, setUser] = useState<User| null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const appContext = {windowWidth};

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

  useEffect(() => {
    const updateWindowWidth = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 500);
    window.addEventListener('resize', updateWindowWidth);
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  const userRoutes = (user) ? (
    <>
      <Route exact path={Routes.Lists}
        render={(props) => <PeakListPage {...props} userId={user._id} />}
      />
      <Route exact path={Routes.ListsWithDetail}
        render={(props) => <PeakListPage {...props} userId={user._id} />}
      />
      <Route exact path={Routes.ListDetail}
        render={(props) => <PeakListDetailPage {...props} userId={user._id} />}
      />
      <Route exact path={Routes.ListDetailWithMountainDetail}
        render={(props) => <PeakListDetailPage {...props} userId={user._id} />}
      />
      <Route exact path={Routes.MountainDetail}
        render={(props) => <MountainDetailPage {...props} userId={user._id} />}
      />
      <Route exact path={Routes.Friends}
        render={(props) => <ListUsersPage {...props} userId={user._id} />}
      />
      <Route exact path={Routes.FriendsWithProfile}
        render={(props) => <ListUsersPage {...props} userId={user._id} />}
      />
      <Route exact path={Routes.UserProfile}
        render={(props) => <UserProfile {...props} userId={user._id} />}
      />
      <Route exact path={Routes.ComparePeakList}
        render={(props) => <UserProfile {...props} userId={user._id} />}
      />
      <Route exact path={Routes.ComparePeakListIsolated}
        render={(props) => <ComparePeakListPage {...props} userId={user._id} />}
      />
      <Route exact path={Routes.CompareAllPeaks}
        render={(props) => <ComparePeakListPage {...props} userId={user._id} />}
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
      <AppContext.Provider value={appContext}>
        <ApolloProvider client={client}>
          <GlobalStyles />
          <Router>
            <Root>
              <Header />
              {adminRoutes}
              {userRoutes}
              <div id={overlayPortalContainerId} />
            </Root>
          </Router>
        </ApolloProvider>
      </AppContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
