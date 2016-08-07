import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, hashHistory  } from "react-router";
import { syncHistoryWithStore } from 'react-router-redux'

import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { routerMiddleware, push } from 'react-router-redux'

import App from './components/App';
import Welcome from './components/Welcome';
import Server from './components/server/Server';
import Client from './components/client/Client';

import indexReducer from './reducers/index';

import styles from './styles.js';

var historyImpl = hashHistory //browserHistory

let middleware = null;
if (process.env.NODE_ENV == "production") {
  middleware = applyMiddleware(
    thunk,
    routerMiddleware(historyImpl)
  )
}
else {
  middleware = applyMiddleware(
    createLogger(),
    thunk,
    routerMiddleware(historyImpl)
  )
}

const store = createStore(indexReducer, middleware);

const history = syncHistoryWithStore(historyImpl, store);
const app = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Welcome} />
          <Route path="play" component={Server} />
          <Route path="playlist/:serverId" component={Client} />
        </Route>
      </Router>
  </Provider>,
app);
