import { switchcaseF } from '../utils/ReducerHelper';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//=============== TYPES =================//
export const types = {
	SAVE_USER_INFO: 'AUTH/SAVE_USER_INFO',
};

//=============== ACTIONS =================//
export const actions = {
	saveUserInfo: (
		username) => ({
		username,
		type: types.SAVE_USER_INFO
	}),
};

//=============== REDUCER =================//
const initialState = {
	username: '',
};

const authReducer = (state = initialState, action) =>
	switchcaseF({
		[types.SAVE_USER_INFO]: {
			username: 'joshua',
		},
	})(state)(action.type);

const authPersistConfig = {
	key: 'wee-auth',
	storage: storage,
	blacklist: ['something']
};

export default persistReducer(authPersistConfig, authReducer);