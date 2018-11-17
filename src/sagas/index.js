import { fork } from 'redux-saga/effects';
import mainDashBoard from './mainDashBoard';

const combinedSagas = [
	...mainDashBoard,
];

export default function* rootSaga() {
	yield combinedSagas.map(saga => fork(saga));
}
