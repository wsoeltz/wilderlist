import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { Routes } from '../../../routing/routes';
import PleaseLogin from '../../sharedComponents/PleaseLogin';
import AddTripReport from './Add';
import EditTripReport from './Edit';

const TripReportForm = () => {
  const user = useCurrentUser();
  if (!user && user !== null) {
    return <PleaseLogin />;
  }
  return (
    <Switch>
      <Route exact path={Routes.AddTripReport} component={AddTripReport} />
      <Route exact path={Routes.EditTripReport} component={EditTripReport} />
    </Switch>
  );
};

export default TripReportForm;
