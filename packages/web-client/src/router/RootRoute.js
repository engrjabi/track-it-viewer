import React from "react";
import TopLevelContainer from "../containers/TopLevelContainer";
import { Router } from "@reach/router";
import { AsyncMainDashBoard, AsyncNotFoundPage } from "./asyncLoaders";

//----------------URL PATHS----------------//
export const urlPaths = {
  home: "/"
};

class Root extends React.Component {
  render() {
    return (
      <TopLevelContainer>
        <Router>
          <AsyncMainDashBoard path={urlPaths.home} />
          <AsyncNotFoundPage path="*" />
        </Router>
      </TopLevelContainer>
    );
  }
}

export default Root;
