import React from 'react';
import Helmet from 'react-helmet';
import {
  Route,
  Switch,
} from 'react-router-dom';
import useCurrentUser from '../../../hooks/useCurrentUser';
import useFluent from '../../../hooks/useFluent';
import { Routes } from '../../../routing/routes';
import PleaseLogin from '../../sharedComponents/PleaseLogin';
import AddTripReport from './Add';
import EditTripReport from './Edit';

const TripReportForm = () => {
  const getString = useFluent();
  const user = useCurrentUser();
  if (!user && user !== null) {
    return <PleaseLogin />;
  }
  return (
    <>
      <Helmet>
        <title>{getString('meta-data-log-trip-title')}</title>
      </Helmet>
      <Switch>
        <Route exact path={Routes.AddTripReport} component={AddTripReport} />
        <Route exact path={Routes.EditTripReport} component={EditTripReport} />
      </Switch>
    </>
  );
};

export default TripReportForm;
