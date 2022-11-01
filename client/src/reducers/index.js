import snapshotReducer from './snapshot.js';
import isLoggedInReducer from './isLoggedIn.js';
import filterReducer from './filter.js';
import showModalReducer from './showModal.js';
import selectedReducer from './selected.js';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    snapshot: snapshotReducer,
    isLoggedIn: isLoggedInReducer,
    filter: filterReducer,
    showModal: showModalReducer,
    selected: selectedReducer 
})

export default allReducers;