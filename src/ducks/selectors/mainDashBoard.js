import { createSelector } from 'reselect';
import { singleSelectorsCreation } from '../../utils/selectorHelper';

const getGreetings = (state, props) => state.mainDashBoard.greetings;
const getVeryDeepState = (state, props) => state.mainDashBoard.veryDeepState;

//===================Selector Functions============================//

export const mainDashBoardSingleSelector = singleSelectorsCreation({
	makeGetGreetings: getGreetings,
});

export const makeGetVeryDeepState = createSelector(
	[getVeryDeepState],
	(veryDeepState) => {
		return `${JSON.stringify(veryDeepState)}`;
	}
);

export const makeGetVeryDeepStateAndGreetings = createSelector(
	[getVeryDeepState, getGreetings],
	(veryDeepState, greetings) => {
		return `${JSON.stringify(veryDeepState)} ${greetings}`;
	}
);
