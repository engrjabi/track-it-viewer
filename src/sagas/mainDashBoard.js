import { put, takeLatest } from 'redux-saga/effects';
import { types, actions } from '../ducks/mainDashBoard';

function* watchToggleDeepNestedObject() {
	yield takeLatest(
		types.TOGGLE_DEEP_NESTED_OBJECT,

		function* (action) {
			const { newValueFirst, newValueSecond, newValueThird } = action;
			yield put(actions.updateNestedState(`${newValueFirst} ${newValueSecond} ${newValueThird}`));
		}
	);
}

function* watchToggleGreetings() {
	yield takeLatest(
		types.TOGGLE_GREETINGS,

		function* (action) {
			const { newValueFirst, newValueSecond, newValueThird } = action;
			yield put(actions.updateGreetings(`${newValueFirst} ${newValueSecond} ${newValueThird}`));
		}
	);
}

export default [
	watchToggleDeepNestedObject,
	watchToggleGreetings,
];
