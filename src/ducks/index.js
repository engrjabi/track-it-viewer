import { sortObjKeysAlphabetically } from '../utils/Formatters';
import { combineReducers } from 'redux';
import mainDashBoard from './mainDashBoard';
import auth from './auth';

const sortedReducer = sortObjKeysAlphabetically({
	mainDashBoard,
	auth,
});

export default combineReducers(sortedReducer);
