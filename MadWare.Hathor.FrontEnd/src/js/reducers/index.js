import { combineReducers } from "redux";
import { routerReducer } from 'react-router-redux';

import serverReducer from './serverReducer';
import clientReducer from './clientReducer';
import playlistReducer from './playlistReducer';

const indexReducer = combineReducers({
  server: serverReducer,
  client: clientReducer,
  playlist: playlistReducer,
  routing: routerReducer
});

export default indexReducer;
