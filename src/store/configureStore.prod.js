import { applyMiddleware, createStore } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import rootReducer from '../ducks';
import rootSaga from '../sagas';
import { createBrowserHistory } from 'history';

export default function configureStore(initialState) {
	const history = createBrowserHistory();
	const reducer = connectRouter(history)(rootReducer);

	// Add so dispatched route actions to the history
	const reduxRouterMiddleware = routerMiddleware(history);
	const sagaMiddleware = createSagaMiddleware();
	const middleware = applyMiddleware(reduxRouterMiddleware, sagaMiddleware);
	const store = createStore(reducer, initialState, middleware);
	sagaMiddleware.run(rootSaga);
	let persistor = persistStore(store);
	return { persistor, store, history }
}
