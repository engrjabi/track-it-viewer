import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/lib/integration/react';
import routes from './routes';
import TopLevelContainer from '../containers/TopLevelContainer';

export default class Root extends React.Component {
	render() {
		const { store, persistor, history } = this.props;
		return (
			<div>
				<Provider store={store}>
					<PersistGate persistor={persistor}>
						<TopLevelContainer>
							<ConnectedRouter history={history}>
								{routes}
							</ConnectedRouter>
						</TopLevelContainer>
					</PersistGate>
				</Provider>
			</div>
		);
	}
}
