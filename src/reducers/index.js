import { persistCombineReducers } from 'redux-persist';
import { connectRouter } from 'connected-react-router';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import storage from 'redux-persist/lib/storage/session';
import config from './reducer_config.js'
import isAdmin from './reducer_admin.js'


const persist_config = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel1,
  blacklist: []
}

export default (history) => persistCombineReducers(persist_config, {
  router: connectRouter(history),
  config,
  isAdmin
})