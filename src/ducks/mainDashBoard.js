import { switchcaseF, mergeState } from '../utils/ReducerHelper';

//=============== TYPES =================//
export const types = {
	TOGGLE_GREETINGS: 'MAIN_DASHBOARD/TOGGLE_GREETINGS',
	UPDATE_GREETINGS: 'MAIN_DASHBOARD/UPDATE_GREETINGS',

	TOGGLE_DEEP_NESTED_OBJECT: 'MAIN_DASHBOARD/TOGGLE_DEEP_NESTED_OBJECT',
	UPDATE_DEEP_NESTED_OBJECT: 'MAIN_DASHBOARD/UPDATE_DEEP_NESTED_OBJECT',
};

//=============== ACTIONS =================//
export const actions = {
	toggleGreetings: (
		newValueFirst, newValueSecond, newValueThird) => ({
		newValueFirst, newValueSecond, newValueThird,
		type: types.TOGGLE_GREETINGS
	}),
	updateGreetings: (
		newGreetings) => ({
		newGreetings,
		type: types.UPDATE_GREETINGS,
	}),

	toggleNestedState: (
		newValueFirst, newValueSecond, newValueThird) => ({
		newValueFirst, newValueSecond, newValueThird,
		type: types.TOGGLE_DEEP_NESTED_OBJECT,
	}),
	updateNestedState: (newValue) => ({
		newValue,
		type: types.UPDATE_DEEP_NESTED_OBJECT,
	}),
};

//=============== REDUCER =================//
const initialState = {
	greetings: 'hi',
	veryDeepState: {
		a: {
			0: 'hello',
			1: 'kamusta',
			3: {
				very: 'deep',
				nested: {
					hello: 'world',
					someProperty: 'foo'
				}
			}
		}
	},
};

export default (state = initialState, action) =>
	switchcaseF({
		[types.UPDATE_GREETINGS]: {
			greetings: action.newGreetings,
		},
		[types.UPDATE_DEEP_NESTED_OBJECT]: mergeState(state,
			{
				veryDeepState: {
					a: {
						3: {
							nested: {
								someProperty: action.newValue,
							}
						}
					}
				},
			}),
	})(state)(action.type);