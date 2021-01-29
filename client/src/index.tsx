import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import * as Sentry from '@sentry/react';
import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import 'regenerator-runtime/runtime';
import App from './components/App';
import {
  appLocalizationAndBundle as fluentValue,
  AppLocalizationAndBundleContext as FluentText,
} from './contextProviders/getFluentLocalizationContext';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({dsn: 'https://6f07b454e1a84442b2f2ec02bc0996a4@o425164.ingest.sentry.io/5357955'});
}

ReactDOM.render((
  <ApolloProvider client={client}>
    <FluentText.Provider value={fluentValue}>
      <Router>
        <App />
      </Router>
    </FluentText.Provider>
  </ApolloProvider>
), document.getElementById('root'));
