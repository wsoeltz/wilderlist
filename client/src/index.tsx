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
import NoApp from './components/NoApp';
import {
  appLocalizationAndBundle as fluentValue,
  AppLocalizationAndBundleContext as FluentText,
} from './contextProviders/getFluentLocalizationContext';
import { getBrowser } from './Utils';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

Sentry.init({dsn: 'https://6f07b454e1a84442b2f2ec02bc0996a4@o425164.ingest.sentry.io/5357955'});

const {browser, version} = getBrowser();

if ( browser === 'IE'                       ||
    (browser === 'Edge' && version < 16)    ||
    (browser === 'Firefox' && version < 54) ||
    (browser === 'Opera' && version < 44)   ||
    (browser === 'Safari' && version < 11)  ) {
  ReactDOM.render(<NoApp browser={browser} version={version} />, document.getElementById('root'));
} else {
  ReactDOM.render((
    <ApolloProvider client={client}>
      <FluentText.Provider value={fluentValue}>
        <Router>
          <App />
        </Router>
      </FluentText.Provider>
    </ApolloProvider>
  ), document.getElementById('root'));
}
