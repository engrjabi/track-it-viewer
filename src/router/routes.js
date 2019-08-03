import React from "react";
import { Route, Switch } from "react-router";
import { AsyncMainDashBoard, AsyncNotFoundPage } from "./asyncLoaders";

//----------------URL PATHS----------------//
export const urlPaths = {
  home: "/"
};

//----------------ROUTES----------------//
export default (
  <Switch>
    {/*no auth pages*/}
    <Route exact path={urlPaths.home} component={AsyncMainDashBoard} />
    {/*no page found*/}
    <Route path="*" component={AsyncNotFoundPage} />
  </Switch>
);
