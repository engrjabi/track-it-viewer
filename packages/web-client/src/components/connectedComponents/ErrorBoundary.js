import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log(`${error}\n${JSON.stringify(info)}`, "error");
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-page">Oops, An unexpected error occurred.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
