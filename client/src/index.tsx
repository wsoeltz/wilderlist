import * as Sentry from '@sentry/react';
import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import App from './components/App';
import {
  appLocalizationAndBundle as fluentValue,
  AppLocalizationAndBundleContext as FluentText,
} from './contextProviders/fluent/getFluentLocalizationContext';
import {
  BrowserRouter,
} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

Sentry.init({dsn: 'https://6f07b454e1a84442b2f2ec02bc0996a4@o425164.ingest.sentry.io/5357955'});

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL,
  cache: new InMemoryCache(),
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <FluentText.Provider value={fluentValue}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FluentText.Provider>
  </ApolloProvider>
), document.getElementById('root'));
