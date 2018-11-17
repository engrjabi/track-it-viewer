import React from 'react';
import { Route, Switch } from 'react-router';
import {
	AsyncMainDashBoard,
	AsyncLandingPage,
	AsyncNotFoundPage,
} from './asyncLoaders';

//----------------URL PATHS----------------//
export const urlPaths = {
	home: '/',
	dashboard: '/dashboard',
};

//----------------ROUTES----------------//
export default (
	<Switch>
		{/*no auth pages*/}
		<Route exact path={urlPaths.home} component={AsyncLandingPage}/>
		{/*need auth pages*/}
		<Route path={urlPaths.dashboard} component={AsyncMainDashBoard}/>
		{/*no page found*/}
		<Route path="*" component={AsyncNotFoundPage}/>
	</Switch>
);
