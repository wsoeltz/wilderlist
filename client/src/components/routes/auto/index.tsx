import React from 'react';
import {
  Switch,
} from 'react-router-dom';
import {Routes} from '../../../routing/routes';
import TrackedRoute from '../../../routing/TrackedRoute';
import {
  RouteDetailCampsiteToCampsite,
  RouteDetailMountainToCampsite,
  RouteDetailParkingToMountain,
  RouteDetailTrailToCampsite,
  RouteDetailTrailToMountain,
} from './dataWrappers';

const AutoRoutes = () => {
  return (
    <Switch>
      <TrackedRoute exact path={Routes.AutoRouteDetailParkingToMountain} component={RouteDetailParkingToMountain} />
      <TrackedRoute exact path={Routes.AutoRouteDetailMountainToCampsite} component={RouteDetailMountainToCampsite} />
      <TrackedRoute exact path={Routes.AutoRouteDetailCampsiteToCampsite} component={RouteDetailCampsiteToCampsite} />
      <TrackedRoute exact path={Routes.AutoRouteDetailTrailToMountain} component={RouteDetailTrailToMountain} />
      <TrackedRoute exact path={Routes.AutoRouteDetailTrailToCampsite} component={RouteDetailTrailToCampsite} />
    </Switch>
  );
};

export default AutoRoutes;
