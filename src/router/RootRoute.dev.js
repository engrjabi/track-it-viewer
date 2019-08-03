import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { PersistGate } from "redux-persist/lib/integration/react";
import routes from "./routes";
import TopLevelContainer from "../containers/TopLevelContainer";
import { hot } from "react-hot-loader";

class Root extends React.Component {
  render() {
    const { store, persistor, history } = this.props;
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <TopLevelContainer>
            <ConnectedRouter history={history}>{routes}</ConnectedRouter>
          </TopLevelContainer>
        </PersistGate>
      </Provider>
    );
  }
}

export default hot(module)(Root);
