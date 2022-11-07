import apis from "../api";

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
    return apis.getFilteredSnapshot(id, {query: query}).then(response => {
      if(response.status === 200) {dispatch(setSearchResults(response));}
    });
  };
}

export function getAccessControlPoliciesFromBackend() {
  return async (dispatch) => {
    return apis.getAccessControlPolicies().then(response => {
      if(response.status === 200) {dispatch(setAccessControlPolicies(response));}
    });
  };
}

export function addAccessControlPolicyToBackend() {
  return async (dispatch) => {
    return apis.addAccessControlPolicy().then(response => {
      if(response.status === 200) {dispatch(addAccessControlPolicy(response));}
    });
  };
}

//ACTIONS
const setAllSnapshotInfo = (response) => {
  console.log(response);
  return {
      type: 'SET_ALL_SNAPSHOT_INFO',
      payload: response.data.snapshotInfo
  };
}

const setSnapshot = (response) => {
    console.log(response);
    return {
        type: 'SET_SNAPSHOT',
        payload: response.data.fileSnapshot
    };
}

const setSearchResults = (response) => {
  console.log(response);
  return {
      type: 'SET_SEARCH_RESULTS',
      payload: response.data
  };
}

const setAccessControlPolicies = (response) => {
    console.log(response);
    return {
      type: 'SET_ACCESS_CONTROL_POLICIES',
      payload: response.data
    }
}

const addAccessControlPolicy = (response) => {
    console.log(response);
    return {
      type: 'ADD_ACCESS_CONTROL_POLICY',
      payload: response.data
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

export {
  showModal,
  hideModal,
  selectFile,
  unselectFile,
  setFilter,
  sortByName,
  sortByDateOld,
  sortByDateNew
}