import * as React from 'react';
import * as ReactDOM from 'react-dom';
import store from './store/store';
import App from './App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
(window as any).$ = (window as any).jQuery = require('jquery');

declare var $: any;

$(document).ready(function() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
});

registerServiceWorker();