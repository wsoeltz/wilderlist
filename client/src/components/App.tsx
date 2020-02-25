import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import axios from 'axios';
import 'cross-fetch/polyfill';
import debounce from 'lodash/debounce';
import 'normalize.css';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import Helmet from 'react-helmet';
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
import CreateMountain from './mountains/create';
import MountainDetailPage from './mountains/detail';
import ListMountainsPage from './mountains/list';
import ComparePeakListPage from './peakLists/compare';
import CreatePeakList from './peakLists/create';
import PeakListDetailPage from './peakLists/detail';
import PeakListPage from './peakLists/list';
import PrivacyPolicy from './privacyPolicy';
import PageNotFound from './sharedComponents/404';
import Header from './sharedComponents/Header';
import UserProfile from './users/detail';
import ListUsersPage from './users/list';
import UserSettings from './users/settings';

if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID, {debug: false});
}
const TrackedRoute = (props: any) => {
  useEffect(() => {
    const page = props.location.pathname;
    ReactGA.set({page});
    ReactGA.pageview(page);
  }, [props.location.pathname]);

  return (
    <Route {...props}/>
  );
};

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
        <TrackedRoute path={Routes.Admin}
          render={(props: any) => <AdminPanel {...props} />}
        />
        <TrackedRoute exact path={Routes.AdminStates}
          render={(props: any) => <AdminStates {...props} />}
        />
        <TrackedRoute exact path={Routes.AdminPeakLists}
          render={(props: any) => <AdminPeakLists {...props} />}
        />
        <TrackedRoute exact path={Routes.AdminMountains}
          render={(props: any) => <AdminMountains {...props} />}
        />
        <TrackedRoute exact path={Routes.AdminRegions}
          render={(props: any) => <AdminRegions {...props} />}
        />
        <TrackedRoute exact path={Routes.AdminUsers}
          render={(props: any) => <AdminUsers {...props} />}
        />
      </>
    ) : null;

  let userRoutes: React.ReactElement<any> | null;
  if (user === null) {
    userRoutes = null;
  } else if (user) {
    userRoutes = (
      <Switch>
        <TrackedRoute exact path={Routes.Dashboard}
          render={(props: any) => <Dashboard {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.DashboardWithPeakListDetail}
          render={(props: any) => <Dashboard {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.ListsWithDetail}
          render={(props: any) => (
            <PeakListPage {...props}
              userId={user._id}
              peakListPermissions={user.peakListPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.ListDetail}
          render={(props: any) => <PeakListDetailPage {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.ListDetailWithMountainDetail}
          render={(props: any) => <PeakListDetailPage {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.MountainSearchWithDetail}
          render={(props: any) => (
            <ListMountainsPage {...props}
              userId={user._id}
              mountainPermissions={user.mountainPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.MountainDetail}
          render={(props: any) => <MountainDetailPage {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.FriendsWithProfile}
          render={(props: any) => <ListUsersPage {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.UserProfile}
          render={(props: any) => <UserProfile {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.UserSettings}
          render={(props: any) => <UserSettings {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.OtherUserPeakList}
          render={(props: any) => <UserProfile {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.OtherUserPeakListDetail}
          render={(props: any) => <PeakListDetailPage {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.OtherUserPeakListCompare}
          render={(props: any) => <UserProfile {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.ComparePeakListIsolated}
          render={(props: any) => <ComparePeakListPage {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.ComparePeakListWithMountainDetail}
          render={(props: any) => <ComparePeakListPage {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.CreateMountain}
          render={(props: any) => (
            <CreateMountain {...props}
              userId={user._id}
              mountainPermissions={user.mountainPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.EditMountain}
          render={(props: any) => (
            <CreateMountain {...props}
              userId={user._id}
              mountainPermissions={user.mountainPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.CreateList}
          render={(props: any) => (
            <CreatePeakList {...props}
              userId={user._id}
              peakListPermissions={user.peakListPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.EditList}
          render={(props: any) => (
            <CreatePeakList {...props}
              userId={user._id}
              peakListPermissions={user.peakListPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.PrivacyPolicy} component={PrivacyPolicy} />
        {adminRoutes}
        {/* 404 Route -> */}
        <TrackedRoute component={PageNotFound} />
      </Switch>
    );
  } else {
    userRoutes = (
      <Switch>
        <TrackedRoute exact path={Routes.ListsWithDetail}
          render={(props: any) => (
            <PeakListPage {...props}
              userId={null}
              peakListPermissions={null}
            />
          )}
        />
        <TrackedRoute exact path={Routes.ListDetail}
          render={(props: any) => <PeakListDetailPage {...props} userId={null} />}
        />
        <TrackedRoute exact path={Routes.ListDetailWithMountainDetail}
          render={(props: any) => <PeakListDetailPage {...props} userId={null} />}
        />
        <TrackedRoute exact path={Routes.MountainSearchWithDetail}
          render={(props: any) => (
            <ListMountainsPage {...props}
              userId={null}
              mountainPermissions={null}
            />
          )}
        />
        <TrackedRoute exact path={Routes.MountainDetail}
          render={(props: any) => <MountainDetailPage {...props} userId={null} />}
        />
        <TrackedRoute exact path={Routes.PrivacyPolicy} component={PrivacyPolicy} />
        {/* Routes that may be shared while a user that is logged in
            should redirect to the closest possible public page -> */}

        <TrackedRoute exact path={Routes.DashboardWithPeakListDetail}
          render={(props: any) => <PeakListDetailPage {...props} userId={null} />}
        />

        <TrackedRoute exact path={Routes.OtherUserPeakList}
          render={(props: any) => <PeakListDetailPage {...props} userId={null} />}
        />
        <TrackedRoute exact path={Routes.OtherUserPeakListDetail}
          render={(props: any) => <PeakListDetailPage {...props} userId={null} />}
        />
        <TrackedRoute exact path={Routes.OtherUserPeakListCompare}
          render={(props: any) => <PeakListDetailPage {...props} userId={null} />}
        />
        <TrackedRoute exact path={Routes.ComparePeakListIsolated}
          render={(props: any) => <PeakListDetailPage {...props} userId={null} />}
        />
        <TrackedRoute exact path={Routes.ComparePeakListWithMountainDetail}
          render={(props: any) => <PeakListDetailPage {...props} userId={null} />}
        />

        <TrackedRoute exact path={Routes.Login} component={LoginPage} />

        {/* 404 Route -> */}
        <TrackedRoute component={PageNotFound} />
      </Switch>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <AppContext.Provider value={appContext}>
        <ApolloProvider client={client}>
          <FluentText.Provider value={fluentValue}>
            <Helmet>
              <title>{'Wilderlist'}</title>
            </Helmet>
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
