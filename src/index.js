import React from "react";
import ReactDOM from "react-dom";
import "./containers/TopLevelContainer/style.css";
import RootRoute from "./router/RootRoute";
import registerServiceWorker from "./registerServiceWorker";

const target = document.getElementById("root");

ReactDOM.render(<RootRoute />, target);
registerServiceWorker();
