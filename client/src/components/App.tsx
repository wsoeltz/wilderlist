import axios from 'axios';
import 'cross-fetch/polyfill';
import debounce from 'lodash/debounce';
import 'normalize.css';
import React, { Suspense, useEffect, useState } from 'react';
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
import useUsersLocation, {
  userAllowsPreciseLocation,
  UsersLocation,
} from '../hooks/useUsersLocation';
import { defaultOgImageUrl, Routes } from '../routing/routes';
import '../styling/fonts/fonts.css';
import GlobalStyles from '../styling/GlobalStyles';
import { Root } from '../styling/Grid';
import { PermissionTypes, User } from '../types/graphQLTypes';
import { overlayPortalContainerId } from '../Utils';
import MountainDetailPage from './mountains/detail';
import ListMountainsPage from './mountains/list';
import PeakListDetailPage from './peakLists/detail';
import PeakListPage from './peakLists/list';
import Header from './sharedComponents/Header';
import LoadingSuspense from './sharedComponents/LoadingSuspense';

const PrivacyPolicy = React.lazy(() => import('./privacyPolicy'));
const About = React.lazy(() => import('./about'));
const TermsOfUse = React.lazy(() => import('./termsOfUse'));
const Dashboard = React.lazy(() => import('./dashboard'));
const LoginPage = React.lazy(() => import('./login'));
const YourStats = React.lazy(() => import('./stats'));
const UserProfile = React.lazy(() => import('./users/detail'));
const ListUsersPage = React.lazy(() => import('./users/list'));
const UserPeakListWithMountain = React.lazy(() => import('./users/peakListMountain'));
const UserSettings = React.lazy(() => import('./users/settings'));
const PageNotFound = React.lazy(() => import('./sharedComponents/404'));
const CreatePeakList = React.lazy(() => import('./peakLists/create'));
const CreateMountain = React.lazy(() => import('./mountains/create'));
const ComparePeakListPage = React.lazy(() => import('./peakLists/compare'));

const AdminPanel = React.lazy(() => import ('./adminPanel'));
const AdminMountains = React.lazy(() => import ('./adminPanel/AdminMountains'));
const AdminPeakLists = React.lazy(() => import ('./adminPanel/AdminPeakLists'));
const AdminRegions = React.lazy(() => import ('./adminPanel/AdminRegions'));
const AdminStates = React.lazy(() => import ('./adminPanel/AdminStates'));
const AdminUsers = React.lazy(() => import ('./adminPanel/AdminUsers'));

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
  usersLocation: UsersLocation;
}

export const UserContext = React.createContext<User | null>(null);
export const AppContext = React.createContext<IAppContext>({
  windowWidth: window.innerWidth,
  usersLocation: {
    loading: true,
    error: undefined,
    data: undefined,
    requestAccurateLocation: undefined,
  },
});

const App: React.FC = () => {
  const [user, setUser] = useState<User| null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [checkedForAccurateLocationOnLoad, setCheckedForAccurateLocationOnLoad] = useState<boolean>(false);

  const usersLocation = useUsersLocation();

  const appContext = {windowWidth, usersLocation};

  useEffect(() => {
    if (usersLocation !== undefined && usersLocation.loading === false && checkedForAccurateLocationOnLoad === false) {
      if (userAllowsPreciseLocation() && usersLocation.requestAccurateLocation) {
        usersLocation.requestAccurateLocation();
      }
      setCheckedForAccurateLocationOnLoad(true);
    }
  }, [usersLocation, checkedForAccurateLocationOnLoad, setCheckedForAccurateLocationOnLoad]);

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
          render={(props: any) => <AdminPanel {...props} />}
        />
        <Route exact path={Routes.AdminStates}
          render={(props: any) => <AdminStates {...props} />}
        />
        <Route exact path={Routes.AdminPeakLists}
          render={(props: any) => <AdminPeakLists {...props} />}
        />
        <Route exact path={Routes.AdminMountains}
          render={(props: any) => <AdminMountains {...props} />}
        />
        <Route exact path={Routes.AdminRegions}
          render={(props: any) => <AdminRegions {...props} />}
        />
        <Route exact path={Routes.AdminUsers}
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
        <TrackedRoute exact path={Routes.OtherUserPeakListMountains}
          render={(props: any) => <UserPeakListWithMountain {...props} userId={user._id} />}
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
              user={user}
              mountainPermissions={user.mountainPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.EditMountain}
          render={(props: any) => (
            <CreateMountain {...props}
              user={user}
              mountainPermissions={user.mountainPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.CreateList}
          render={(props: any) => (
            <CreatePeakList {...props}
              user={user}
              peakListPermissions={user.peakListPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.EditList}
          render={(props: any) => (
            <CreatePeakList {...props}
              user={user}
              peakListPermissions={user.peakListPermissions}
            />
          )}
        />
        <TrackedRoute exact path={Routes.YourStats}
          render={(props: any) => <YourStats {...props} userId={user._id} />}
        />
        <TrackedRoute exact path={Routes.About} component={About} />
        <TrackedRoute exact path={Routes.PrivacyPolicy} component={PrivacyPolicy} />
        <TrackedRoute exact path={Routes.TermsOfUse} component={TermsOfUse} />
        {adminRoutes}
        {/* 404 Route -> */}
        <Route component={PageNotFound} />
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
        <TrackedRoute exact path={Routes.About} component={About} />
        <TrackedRoute exact path={Routes.PrivacyPolicy} component={PrivacyPolicy} />
        <TrackedRoute exact path={Routes.TermsOfUse} component={TermsOfUse} />
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
        <Route component={PageNotFound} />
      </Switch>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <AppContext.Provider value={appContext}>
        <FluentText.Provider value={fluentValue}>
          <Helmet>
            {/* Set default meta data values */}
            <title>{'Wilderlist'}</title>
            <meta
              name='description'
              content='Track, plan and share your hiking and mountaineering adventures.'
            />
            <meta property='og:title' content='Wilderlist' />
            <meta
              property='og:description'
              content='Track, plan and share your hiking and mountaineering adventures.'
            />
            <meta property='og:image' content={defaultOgImageUrl} />
            <link rel='canonical' href={process.env.REACT_APP_DOMAIN_NAME + window.location.pathname} />
          </Helmet>
          <GlobalStyles />
          <Router>
            <Root>
              <Header />
              <Suspense fallback={<LoadingSuspense />}>
                {userRoutes}
              </Suspense>
              <OverlayPortal id={overlayPortalContainerId} />
            </Root>
          </Router>
        </FluentText.Provider>
      </AppContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
