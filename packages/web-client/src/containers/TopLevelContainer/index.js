import React from "react";
import ErrorBoundary from "../../components/connectedComponents/ErrorBoundary";
import "./style.css";

class TopLevelContainer extends React.Component {
  static defaultProps = {};

  render() {
    return (
      <div className={`app`}>
        {/*<Header/>*/}
        <ErrorBoundary>
          <div className="main-content">{this.props.children}</div>
        </ErrorBoundary>
        {/*<Footer/>*/}
      </div>
    );
  }
}

export default TopLevelContainer;
