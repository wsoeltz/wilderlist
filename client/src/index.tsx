import * as Sentry from '@sentry/react';
import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import App from './components/App';

Sentry.init({dsn: 'https://6f07b454e1a84442b2f2ec02bc0996a4@o425164.ingest.sentry.io/5357955'});

ReactDOM.render(<App />, document.getElementById('root'));
