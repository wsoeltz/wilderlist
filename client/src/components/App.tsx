import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import axios from 'axios';
import 'cross-fetch/polyfill';
import debounce from 'lodash/debounce';
import 'normalize.css';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  appLocalizationAndBundle as fluentValue,
  AppLocalizationAndBundleContext as FluentText,
} from '../contextProviders/getFluentLocalizationContext';
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
import Dashboard from './dashboard';
import LoginPage from './login';
import MountainDetailPage from './mountains/detail';
import ListMountainsPage from './mountains/list';
import ComparePeakListPage from './peakLists/compare';
import PeakListDetailPage from './peakLists/detail';
import PeakListPage from './peakLists/list';
import PrivacyPolicy from './privacyPolicy';
import Header from './sharedComponents/Header';
import UserProfile from './users/detail';
import ListUsersPage from './users/list';
import UserSettings from './users/settings';

const overlayPortalZIndex = 3000;

const OverlayPortal = styled.div`
  position: relative;
  z-index: ${overlayPortalZIndex};
`;

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

  const adminRoutes = (user && user.permissions === PermissionTypes.admin) ? (
      <>
        <Route path={Routes.Admin}
          render={props => <AdminPanel {...props} />}
        />
        <Route exact path={Routes.AdminStates}
          render={props => <AdminStates {...props} />}
        />
        <Route exact path={Routes.AdminPeakLists}
          render={props => <AdminPeakLists {...props} />}
        />
        <Route exact path={Routes.AdminMountains}
          render={props => <AdminMountains {...props} />}
        />
        <Route exact path={Routes.AdminRegions}
          render={props => <AdminRegions {...props} />}
        />
        <Route exact path={Routes.AdminUsers}
          render={props => <AdminUsers {...props} />}
        />
      </>
    ) : null;

  let userRoutes: React.ReactElement<any> | null;
  if (user === null) {
    userRoutes = null;
  } else if (user) {
    userRoutes = (
      <Switch>
        <Route exact path={Routes.Dashboard}
          render={(props) => <Dashboard {...props} userId={user._id} />}
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
        <Route exact path={Routes.MountainSearchWithDetail}
          render={(props) => <ListMountainsPage {...props} userId={user._id} />}
        />
        <Route exact path={Routes.MountainDetail}
          render={(props) => <MountainDetailPage {...props} userId={user._id} />}
        />
        <Route exact path={Routes.FriendsWithProfile}
          render={(props) => <ListUsersPage {...props} userId={user._id} />}
        />
        <Route exact path={Routes.UserProfile}
          render={(props) => <UserProfile {...props} userId={user._id} />}
        />
        <Route exact path={Routes.UserSettings}
          render={(props) => <UserSettings {...props} userId={user._id} />}
        />
        <Route exact path={Routes.OtherUserPeakList}
          render={(props) => <UserProfile {...props} userId={user._id} />}
        />
        <Route exact path={Routes.OtherUserPeakListDetail}
          render={(props) => <PeakListDetailPage {...props} userId={user._id} />}
        />
        <Route exact path={Routes.OtherUserPeakListCompare}
          render={(props) => <UserProfile {...props} userId={user._id} />}
        />
        <Route exact path={Routes.ComparePeakListIsolated}
          render={(props) => <ComparePeakListPage {...props} userId={user._id} />}
        />
        <Route exact path={Routes.ComparePeakListWithMountainDetail}
          render={(props) => <ComparePeakListPage {...props} userId={user._id} />}
        />
        <Route exact path={Routes.PrivacyPolicy} component={PrivacyPolicy} />
        {adminRoutes}
        {/* 404 Route -> */}
        <Route
          render={(props) => <Dashboard {...props} userId={user._id} />}
        />
      </Switch>
    );
  } else {
    userRoutes = (
      <Switch>
        <Route exact path={Routes.ListsWithDetail}
          render={(props) => <PeakListPage {...props} userId={null} />}
        />
        <Route exact path={Routes.ListDetail}
          render={(props) => <PeakListDetailPage {...props} userId={null} />}
        />
        <Route exact path={Routes.ListDetailWithMountainDetail}
          render={(props) => <PeakListDetailPage {...props} userId={null} />}
        />
        <Route exact path={Routes.MountainSearchWithDetail}
          render={(props) => <ListMountainsPage {...props} userId={null} />}
        />
        <Route exact path={Routes.MountainDetail}
          render={(props) => <MountainDetailPage {...props} userId={null} />}
        />
        <Route exact path={Routes.PrivacyPolicy} component={PrivacyPolicy} />
        <Route path={Routes.Login} component={LoginPage} />
      </Switch>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <AppContext.Provider value={appContext}>
        <ApolloProvider client={client}>
          <FluentText.Provider value={fluentValue}>
            <GlobalStyles />
            <Router>
              <Root>
                <Header />
                {userRoutes}
                <OverlayPortal id={overlayPortalContainerId} />
              </Root>
            </Router>
          </FluentText.Provider>
        </ApolloProvider>
      </AppContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
