import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { enthusiasm } from './reducers/index';
import { StoreState } from './types/index';
// import Hello from './containers/Hello';
import Board from './containers/Board';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
(window as any).$ = (window as any).jQuery = require('jquery');

declare var $: any;

const store = createStore<StoreState>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript'
});

$(document).ready(function() {
  ReactDOM.render(
    <Provider store={store}>
      <Board />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
});

// ReactDOM.render(
//   <Hello name="TypeScript" enthusiasmLevel={10} />,
//   document.getElementById('root') as HTMLElement
// );
registerServiceWorker();
