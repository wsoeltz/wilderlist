import 'cross-fetch/polyfill';
import 'normalize.css';
import React, { Suspense, useEffect } from 'react';
import ReactGA from 'react-ga';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { Routes } from '../../routing/routes';
import MountainDetailPage from '../mountains/detail';
import PeakListDetailPage from '../peakLists/detail';
import LoadingSuspense from '../sharedComponents/LoadingSuspense';

const PrivacyPolicy = React.lazy(() => import('../privacyPolicy'));
const About = React.lazy(() => import('../about'));
const TermsOfUse = React.lazy(() => import('../termsOfUse'));
const Dashboard = React.lazy(() => import('../dashboard'));
const YourStats = React.lazy(() => import('../stats'));
const UserProfile = React.lazy(() => import('../users/detail'));
const UserProfilePeakListDetail = React.lazy(() => import('../users/peakListDetail'));
const UserSettings = React.lazy(() => import('../users/settings'));
const PageNotFound = React.lazy(() => import('../sharedComponents/404'));
const CreatePeakList = React.lazy(() => import('../peakLists/create'));
const CreateMountain = React.lazy(() => import('../mountains/create'));
const ComparePeakListPage = React.lazy(() => import('../peakLists/compare'));

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

const MainContent = () => {
  return (
    <Suspense fallback={<LoadingSuspense />}>
      <Switch>
        <TrackedRoute exact path={Routes.Landing} component={null} />
        <TrackedRoute exact path={Routes.Dashboard} component={Dashboard} />
        <TrackedRoute exact path={Routes.ListDetail} component={PeakListDetailPage} />
        <TrackedRoute exact path={Routes.MountainDetail} component={MountainDetailPage} />
        <TrackedRoute exact path={Routes.UserProfile} component={UserProfile} />
        <TrackedRoute exact path={Routes.UserSettings} component={UserSettings} />
        <TrackedRoute exact path={Routes.OtherUserPeakList} component={UserProfilePeakListDetail} />
        <TrackedRoute exact path={Routes.ComparePeakListIsolated} component={ComparePeakListPage} />
        <TrackedRoute exact path={Routes.CreateMountain} component={CreateMountain} />
        <TrackedRoute exact path={Routes.EditMountain} component={CreateMountain} />
        <TrackedRoute exact path={Routes.CreateList} component={CreatePeakList} />
        <TrackedRoute exact path={Routes.EditList} component={CreatePeakList} />
        <TrackedRoute exact path={Routes.YourStats} component={YourStats} />
        <TrackedRoute exact path={Routes.About} component={About} />
        <TrackedRoute exact path={Routes.PrivacyPolicy} component={PrivacyPolicy} />
        <TrackedRoute exact path={Routes.TermsOfUse} component={TermsOfUse} />
        {/* 404 Route -> */}
        <Route component={PageNotFound} />
      </Switch>
    </Suspense>
  );
};

export default MainContent;