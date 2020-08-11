import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from "react-redux";
import { store, history, persistor } from "./data/store.js";
import { ConnectedRouter } from "connected-react-router";
import { PersistGate } from 'redux-persist/lib/integration/react';
// uncomment if you would like to serve the final site with service workers
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      persistor={persistor}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>, document.getElementById('root'));
// registerServiceWorker();