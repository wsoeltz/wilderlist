import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import AdminPanel from './adminPanel';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_BASE_URL}/graphql`,
});

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
