import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { Routes } from '../../../routing/routes';
import AddTripReport from './Add';
import EditTripReport from './Edit';

const TripReportForm = () => {
  return (
    <Switch>
      <Route exact path={Routes.AddTripReport} component={AddTripReport} />
      <Route exact path={Routes.EditTripReport} component={EditTripReport} />
    </Switch>
  );
};

export default TripReportForm;
