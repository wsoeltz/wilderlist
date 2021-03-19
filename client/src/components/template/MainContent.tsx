import 'cross-fetch/polyfill';
import 'normalize.css';
import React, { Suspense, useEffect, useRef } from 'react';
import ReactGA from 'react-ga';
import {
  Route,
  Switch,
} from 'react-router-dom';
import useScrollToTopOnRender from '../../hooks/useScrollToTopOnRender';
import { Routes } from '../../routing/routes';
import {
  ContentBody,
  ContentContainer,
  ContentHeader,
} from '../../styling/Grid';
import CampsiteDetailPage from '../campsites/detail';
import MountainDetailPage from '../mountains/detail';
import SummitViewPage from '../mountains/detail/summitView';
import PeakListDetailPage from '../peakLists/detail';
import LoadingSuspense from '../sharedComponents/LoadingSuspense';
import TrailDetailPage from '../trails/detail';
import Header from './contentHeader';

const PrivacyPolicy = React.lazy(() => import('../privacyPolicy'));
const About = React.lazy(() => import('../about'));
const TermsOfUse = React.lazy(() => import('../termsOfUse'));
const Dashboard = React.lazy(() => import('../dashboard'));
const YourStats = React.lazy(() => import('../stats'));
const UserProfile = React.lazy(() => import('../users/detail'));
const UserSettings = React.lazy(() => import('../users/settings'));
const PageNotFound = React.lazy(() => import('../sharedComponents/404'));
const CreatePeakList = React.lazy(() => import('../peakLists/create'));
const CreateMountain = React.lazy(() => import('../mountains/create'));
const CreateCampsite = React.lazy(() => import('../campsites/create'));
const EditTrail = React.lazy(() => import('../trails/create/basic'));
const ComparePeakListPage = React.lazy(() => import('../peakLists/compare'));
const AddTripReport = React.lazy(() => import('../tripReports/form'));

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

const ContentRoutes = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useScrollToTopOnRender(containerRef.current);
  return (
    <ContentBody ref={containerRef}>
      <Suspense fallback={<LoadingSuspense />}>
        <Switch>
          <TrackedRoute exact path={Routes.Landing} component={null} />
          <TrackedRoute exact path={Routes.MountainDetail} component={MountainDetailPage} />
          <TrackedRoute exact path={Routes.CampsiteDetail} component={CampsiteDetailPage} />
          <TrackedRoute exact path={Routes.TrailDetail} component={TrailDetailPage} />
          <TrackedRoute exact path={Routes.ListDetail} component={PeakListDetailPage} />
          <TrackedRoute exact path={Routes.Dashboard} component={Dashboard} />
          <TrackedRoute exact path={Routes.UserProfile} component={UserProfile} />
          <TrackedRoute exact path={Routes.UserSettings} component={UserSettings} />
          <TrackedRoute exact path={Routes.OtherUserPeakList} component={ComparePeakListPage} />
          <TrackedRoute exact path={Routes.ComparePeakListIsolated} component={ComparePeakListPage} />
          <TrackedRoute exact path={Routes.AddTripReport} component={AddTripReport} />
          <TrackedRoute exact path={Routes.EditTripReport} component={AddTripReport} />
          <TrackedRoute exact path={Routes.CreateMountain} component={CreateMountain} />
          <TrackedRoute exact path={Routes.EditMountain} component={CreateMountain} />
          <TrackedRoute exact path={Routes.CreateCampsite} component={CreateCampsite} />
          <TrackedRoute exact path={Routes.EditCampsite} component={CreateCampsite} />
          <TrackedRoute exact path={Routes.EditTrail} component={EditTrail} />
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
    </ContentBody>
  );
};

const MainContent = () => {
  return (
    <ContentContainer>
      <ContentHeader>
        <Header />
      </ContentHeader>
      <Switch>
        <TrackedRoute exact path={Routes.Landing} component={null} />
        <TrackedRoute exact path={Routes.SummitView} component={SummitViewPage} />
        <Route component={ContentRoutes} />
      </Switch>
    </ContentContainer>
  );
};

export default MainContent;
