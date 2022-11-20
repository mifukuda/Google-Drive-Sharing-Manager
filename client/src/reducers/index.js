import allSnapshotInfoReducer from './allSnapshotInfo';
import currentSnapshotReducer from './currentSnapshot.js';
import isLoggedInReducer from './isLoggedIn.js';
import filterReducer from './filter.js';
import accessControlPolicyReducer from './accessControlPolicies.js';
import showModalReducer from './showModal.js';
import showCompareModalReducer from './showCompareModal.js';
import selectedFilesReducer from './selectedFiles.js';
import searchResultsReducer from './searchResults.js';
import stagedFilesReducer from './stagedFiles.js';
import addReadersReducer from './addReaders.js';
import addWritersReducer from './addWriters.js';
import addCommentersReducer from './addCommenters.js';
import removeReadersReducer from './removeReaders.js';
import removeWritersReducer from './removeWriters.js';
import removeCommentersReducer from './removeCommenters.js';
import unshareReducer from './unshare.js';
import recentSearchesReducer from './recentSearches.js';
import deviantSharingResultsReducer from './deviantSharingResults.js';
import sharingDifferencesResultsReducer from './sharingDifferencesResults.js'
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    isLoggedIn: isLoggedInReducer,
    allSnapshotInfo: allSnapshotInfoReducer,
    currentSnapshot: currentSnapshotReducer,
    searchResults: searchResultsReducer,
    filter: filterReducer,
    recentSearches: recentSearchesReducer,
    accessControlPolicies: accessControlPolicyReducer,
    showModal: showModalReducer,
    showCompareModal: showCompareModalReducer,
    selectedFiles: selectedFilesReducer,
    stagedFiles: stagedFilesReducer,
    addReaders: addReadersReducer,
    addWriters: addWritersReducer,
    addCommenters: addCommentersReducer,
    removeReaders: removeReadersReducer,
    removeWriters: removeWritersReducer,
    removeCommenters: removeCommentersReducer,
    unshare: unshareReducer,
    deviantSharingResults: deviantSharingResultsReducer,
    sharingDifferencesResults: sharingDifferencesResultsReducer
})

export default allReducers;