/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { createStore, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../ducks';
import rootSaga from '../sagas';
import { composeWithDevTools } from 'redux-devtools-extension';

export default function configureStore(initialState) {

	// Build the middleware for intercepting and dispatching navigation actions
	const history = createBrowserHistory();
	const sagaMiddleware = createSagaMiddleware();
	const reducer = connectRouter(history)(rootReducer);

	const middleware = applyMiddleware(sagaMiddleware, routerMiddleware(history));
	const composeEnhancers = composeWithDevTools({
		// Specify name here, actionsBlacklist, actionsCreators and other options if needed
	});

	const middlewareWithDevTools = composeEnhancers(middleware,);

	// Add the reducer to your store on the `router` key
	// Also apply our middleware for navigating
	const store = createStore(reducer, initialState, middlewareWithDevTools);
	sagaMiddleware.run(rootSaga);
	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../ducks', () => {
			const nextRootReducer = require('../ducks');
			store.replaceReducer(nextRootReducer);
		});
	}

	let persistor = persistStore(store);

	return { persistor, store, history }
}
