import snapshotReducer from './snapshot.js';
import isLoggedInReducer from './isLoggedIn.js';
import filterReducer from './filter.js';
import accessControlPolicyReducer from './accessControlPolicies.js';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    snapshot: snapshotReducer,
    isLoggedIn: isLoggedInReducer,
    filter: filterReducer,
    accessControlPolicies: accessControlPolicyReducer
})

export default allReducers;