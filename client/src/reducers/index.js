import snapshotReducer from './snapshot.js';
import isLoggedInReducer from './isLoggedIn.js';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    snapshot: snapshotReducer,
    isLoggedIn: isLoggedInReducer
})

export default allReducers;