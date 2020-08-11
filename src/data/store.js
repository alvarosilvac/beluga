import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import rootReducer from '../reducers';
import store_config from "../assets/store_config";
import { persistStore } from 'redux-persist'

const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);
const reducers = rootReducer(history);

const initialState = {
  config: store_config
}

const store = createStore(
  reducers,
  initialState,
  compose(
    applyMiddleware(
      routeMiddleware,
      thunk
    )
  )
);

const persistor = persistStore(store)

export { store, history, persistor };