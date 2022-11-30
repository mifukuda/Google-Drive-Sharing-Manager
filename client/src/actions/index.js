import apis from "../api";
import userapis from "../api/user.js"

//THUNKS
export function getAllSnapshotInfoFromBackend() {
  return async (dispatch) => {
    // Get info of all user's snapshots
    return apis.getAllSnaphotInfo().then(response => {
      if(response.status === 200) {
        dispatch(setAllSnapshotInfo(response));
        // If not empty, get the most recent snapshot and set it as current snapshot
        if(response.data.snapshotInfo.length !== 0) {
          let allSnapshotInfo = response.data.snapshotInfo.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
          console.log(allSnapshotInfo);
          dispatch(getSnapshotFromBackend(allSnapshotInfo[0]._id));
          dispatch(getRecentSearchesFromBackend());
        }
        else {
          console.log("Aborting fetch.");
        }
      }
    });
  };
}

export function createSnapshotInBackend() {
  return async (dispatch) => {
    // Create snapshot
    return apis.createSnapshot().then(response => {
      if(response.status === 201) {
        dispatch(setSnapshot(response));
        // Update information of all user's snapshots
        apis.getAllSnaphotInfo().then(response=> {
          dispatch(setAllSnapshotInfo(response));
        })
      }
    });
  };
}

export function getSnapshotFromBackend(id) {
    return async (dispatch) => {
      return apis.getSnapshot({id: id}).then(response => {
        if(response.status === 200) {dispatch(setSnapshot(response));}
      });
    };
}

export function getFilteredSnapshotFromBackend(id, query) {
  return async (dispatch) => {
    return apis.getFilteredSnapshot({query: query, snapshot_id: id}).then(response => {
      if(response.status === 200) {
        dispatch(setSearchResults(response));
        userapis.saveSearch({query: query}).then(response => {
          if (response.status === 200) {
            dispatch(getRecentSearchesFromBackend());
          }
        })
      }
    });
  };
}

export function getAccessControlPoliciesFromBackend() {
  return async (dispatch) => {
    return userapis.getAccessControlPolicies().then(response => {
      console.log("HELLO:" + response );
      if(response.status === 200) {dispatch(setAccessControlPolicies(response));}
    });
  };
}

export function addAccessControlPolicyToBackend(form) {
  return async (dispatch) => {
    return userapis.addAccessControlPolicy(form).then(response => {
      if(response.status === 200) {dispatch(addAccessControlPolicy(response));}
    });
  };
}

export function deleteAccessControlPolicyFromBackend(id) {
  return async (dispatch) => {
    return userapis.deleteAccessControlPolicy({acp_id:id}).then(response => {
      if(response.status === 200) {dispatch(deleteAccessControlPolicy(id));}
    });
  };
}

export function getRecentSearchesFromBackend() {
  return async (dispatch) => {
    return userapis.getRecentSearches().then(response => {
      if(response.status === 200) {dispatch(setRecentSearches(response));}
    });
  };
}

export function getDeviantSharingResultsFromBackend(threshold, id) {
  return async (dispatch) => {
    console.log("request_dev sharing : ",id)
    return apis.performDeviantSharing({threshold: threshold, id: id}).then(response => {
      if(response.status === 200) {dispatch(setDeviantSharingResults(response));}
    });
  };
}

export function getSharingDifferencesResultsFromBackend(id) {
  return async (dispatch) => {
    console.log("request_diff sharing : ",id)
    return apis.performSharingDifferences({id: id}).then(response => {
      if(response.status === 200) {dispatch(setSharingDifferencesResults(response));}
    });
  };
}

export function performSnapshotCompareFromBackend(id1, id2) {
  return async (dispatch) => {
    console.log("request_sharing changes1 : ", id1, "request_sharing changes2 : ", id2)
    return apis.performSnapshotComparison({id1: id1, id2: id2}).then(response => {
      if(response.status === 200) {dispatch(setSnapshotCompareResults(response));}
    });
  };
}

//ACTIONS
const setAllSnapshotInfo = (response) => {
  return {
      type: 'SET_ALL_SNAPSHOT_INFO',
      payload: response.data.snapshotInfo
  };
}

const setSnapshot = (response) => {
    return {
        type: 'SET_SNAPSHOT',
        payload: response.data.fileSnapshot
    };
}

const setSearchResults = (response) => {
  return {
      type: 'SET_SEARCH_RESULTS',
      payload: response.data
  };
}

const setAccessControlPolicies = (response) => {
    console.log(response);
    return {
      type: 'SET_ACCESS_CONTROL_POLICIES',
      payload: response
    }
}

const addAccessControlPolicy = (response) => {
    console.log(response);
    return {
      type: 'ADD_ACCESS_CONTROL_POLICY',
      payload: response
    }
}

const deleteAccessControlPolicy = (response) => {
  console.log(response);
  return {
    type: 'DELETE_ACCESS_CONTROL_POLICY',
    payload: response
  }
}

const setFilter = (text) => {
  return {
      type: 'SET_FILTER',
      payload: text
  };
}

const showModal = () => {
  return {
    type: 'SHOW_MODAL'
  }
}

const hideModal = () => {
  return {
    type: 'HIDE_MODAL'
  }
}

const showCompareModal = () => {
  return {
    type: 'SHOW_COMPARE_MODAL'
  }
}

const hideCompareModal = () => {
  return {
    type: 'HIDE_COMPARE_MODAL'
  }
}

const selectFile = (file) => {
  return {
    type: 'SELECT_FILE',
    payload: file
  }
}

const unselectFile = (file) => {
  return {
    type: 'UNSELECT_FILE',
    payload: file
  }
}

const stageFiles = (files) => {
  return {
    type: 'STAGE_FILES',
    payload: files
  }
}

const sortByName = () => {
  return {
    type: 'SORT_BY_NAME',
  }
}

const sortByDateOld = () => {
  return {
    type: 'SORT_BY_DATE_OLD',
  }
}

const sortByDateNew = () => {
  return {
    type: 'SORT_BY_DATE_NEW',
  }
}

const setRecentSearches = (response) => {
  return {
    type: 'SET_RECENT_SEARCHES',
    payload: response.data.queries
  }
}

const clearUpdateScreen = () => {
  return {
    type: "CLEAR_UPDATE_SCREEN"
  }
}

const clearAnalyzeScreen = () => {
  return {
    type: "CLEAR_ANALYZE_SCREEN"
  }
}

const setDeviantSharingResults = (response) => {
  return {
    type: "SET_DEVIANT_SHARING_RESULTS",
    payload: response.data
  }
}

const setSharingDifferencesResults = (response) => {
  return {
    type: "SET_SHARING_DIFFERENCES_RESULTS",
    payload: response.data
  }
}

const setSnapshotCompareResults = (response) => {
  return {
    type: "SET_COMPARE_SNAPSHOT_RESULTS",
    payload: response.data
  }
}

export {
  showModal,
  hideModal,
  showCompareModal,
  hideCompareModal,
  selectFile,
  unselectFile,
  stageFiles,
  setFilter,
  sortByName,
  sortByDateOld,
  sortByDateNew,
  clearUpdateScreen,
  clearAnalyzeScreen,
  setDeviantSharingResults,
}