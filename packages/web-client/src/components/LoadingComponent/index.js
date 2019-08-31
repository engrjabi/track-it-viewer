import React from "react";
import Loader from "react-loadable";

const DefaultLoadingComponent = props => {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  }
  return null;
};

const Loadable = options =>
  Loader({
    loading: DefaultLoadingComponent,
    delay: 300,
    timeout: 15000,
    ...options
  });

export default Loadable;
