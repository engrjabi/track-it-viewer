import React from 'react';
import ReactDOM from 'react-dom';
import './containers/TopLevelContainer/style.css';
import RootRoute from './router/RootRoute';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';

const initialState = {};
const target = document.getElementById('root');
const { persistor, store, history } = configureStore(initialState);

ReactDOM.render(<RootRoute persistor={persistor} store={store} history={history} />, target);
registerServiceWorker();
