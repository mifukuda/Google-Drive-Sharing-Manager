import allSnapshotInfoReducer from './allSnapshotInfo';
import currentSnapshotReducer from './currentSnapshot.js';
import isLoggedInReducer from './isLoggedIn.js';
import filterReducer from './filter.js';
import accessControlPolicyReducer from './accessControlPolicies.js';
import showModalReducer from './showModal.js';
import selectedFilesReducer from './selectedFiles.js';
import searchResultsReducer from './searchResults.js';
import stagedFilesReducer from './stagedFiles.js';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    allSnapshotInfo: allSnapshotInfoReducer,
    currentSnapshot: currentSnapshotReducer,
    searchResults: searchResultsReducer,
    isLoggedIn: isLoggedInReducer,
    filter: filterReducer,
    accessControlPolicies: accessControlPolicyReducer,
    showModal: showModalReducer,
    selectedFiles: selectedFilesReducer,
    stagedFiles: stagedFilesReducer
})

export default allReducers;