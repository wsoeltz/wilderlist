import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import App from './components/App';
import NoApp from './components/NoApp';
import { getBrowser } from './Utils';

const {browser, version} = getBrowser();

if ( browser === 'IE'                       ||
    (browser === 'Edge' && version < 16)    ||
    (browser === 'Firefox' && version < 54) ||
    (browser === 'Chrome' && version < 58)  ||
    (browser === 'Opera' && version < 44)   ||
    (browser === 'Safari' && version < 11)  ) {
  ReactDOM.render(<NoApp browser={browser} version={version} />, document.getElementById('root'));
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
