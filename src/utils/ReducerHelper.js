//See https://hackernoon.com/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d
import t from './typy';

const executeIfFunction = f =>
	(typeof f === 'function') ? f() : f;

export const switchcase = (cases, defaultCase, key) => {
	//include defaultCase which is usually the whole state when returning the matching case
	const objToReturn = (typeof cases[key] === 'function') ? cases[key] : { ...defaultCase, ...cases[key] };
	return cases.hasOwnProperty(key) ? objToReturn : defaultCase;
};

export const switchcaseF = cases => defaultCase => key =>
	executeIfFunction(switchcase(cases, defaultCase, key));

export const mergeState = (currentState, newState) => {
	let nextState = { ...currentState };

	for (let newStateKey in newState) {

		if (newState.hasOwnProperty(newStateKey)) {
			try {
				// Property in destination object set; update its value.
				if (t(nextState[newStateKey]).isObject) {
					nextState[newStateKey] = mergeState(currentState[newStateKey], newState[newStateKey]);
				} else {
					nextState[newStateKey] = newState[newStateKey];
				}
			} catch (e) {
				// Property in destination object not set; create it and set its value.
				nextState[newStateKey] = newState[newStateKey];
			}
		}
	}

	return nextState;
};