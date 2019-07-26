import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import AdminPanel from './adminPanel';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const uri = BASE_URL === undefined ? '/graphql' : `${BASE_URL}/graphql`;

const client = new ApolloClient({ uri });

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Wilderlist Dev</h1>
        <AdminPanel />
      </div>
    </ApolloProvider>
  );
};

export default App;
