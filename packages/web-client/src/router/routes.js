import React from "react";
import { AsyncMainDashBoard, AsyncNotFoundPage } from "./asyncLoaders";

let Home = () => <div>Home</div>;
let Dash = () => <div>Dash</div>;

//----------------URL PATHS----------------//
export const urlPaths = {
  home: "/"
};

//----------------ROUTES----------------//
export default (
  <>
    {/*no auth pages*/}
    <Home path={urlPaths.home} />
    {/*no page found*/}
    <Dash path="*" />
  </>
);
