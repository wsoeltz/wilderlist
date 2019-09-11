import "core-js/stable";
import "regenerator-runtime/runtime";
import { getBrowser } from './Utils';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

console.log(getBrowser());

ReactDOM.render(<App />, document.getElementById('root'));
