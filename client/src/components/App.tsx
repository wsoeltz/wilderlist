import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom';
import { Routes } from '../routing/routes';
import AdminPanel from './adminPanel';
import AdminLists from './adminPanel/AdminLists';
import AdminMountains from './adminPanel/AdminMountains';
import AdminRegions from './adminPanel/AdminRegions';
import AdminStates from './adminPanel/AdminStates';
import AdminUsers from './adminPanel/AdminUsers';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const uri = BASE_URL === undefined ? '/graphql' : `${BASE_URL}/graphql`;

const client = new ApolloClient({ uri });

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <h1>Wilderlist Dev</h1>
          <nav>
            <ul>
              <li><Link to={Routes.Dashboard}>Dashboard</Link></li>
              <li><Link to={Routes.Admin}>Admin Panel</Link></li>
            </ul>
          </nav>
          <Route path={Routes.Admin} component={AdminPanel} />
          <Route exact path={Routes.AdminStates} component={AdminStates} />
          <Route exact path={Routes.AdminLists} component={AdminLists} />
          <Route exact path={Routes.AdminMountains} component={AdminMountains} />
          <Route exact path={Routes.AdminRegions} component={AdminRegions} />
          <Route exact path={Routes.AdminUsers} component={AdminUsers} />
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
