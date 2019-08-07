import ApolloClient from 'apollo-boost';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { Routes } from '../routing/routes';
import { User } from '../types/graphQLTypes';
import AdminPanel from './adminPanel';
import AdminLists from './adminPanel/AdminLists';
import AdminMountains from './adminPanel/AdminMountains';
import AdminRegions from './adminPanel/AdminRegions';
import AdminStates from './adminPanel/AdminStates';
import AdminUsers from './adminPanel/AdminUsers';
import Header from './sharedComponents/Header';

const client = new ApolloClient();
export const UserContext = React.createContext<User | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<User| null>(null);

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

  const routes = (user) ? (
      <>
        <Route path={Routes.Admin} component={AdminPanel} />
        <Route exact path={Routes.AdminStates} component={AdminStates} />
        <Route exact path={Routes.AdminLists} component={AdminLists} />
        <Route exact path={Routes.AdminMountains} component={AdminMountains} />
        <Route exact path={Routes.AdminRegions} component={AdminRegions} />
        <Route exact path={Routes.AdminUsers} component={AdminUsers} />
      </>
    ) : null;

  return (
    <UserContext.Provider value={user}>
      <ApolloProvider client={client}>
        <Router>
          <div>
            <Header />
            {routes}
          </div>
        </Router>
      </ApolloProvider>
    </UserContext.Provider>
  );
};

export default App;
