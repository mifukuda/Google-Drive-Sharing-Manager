import apis from "../api";

//THUNKS
export function getSnapshotFromBackend() {
    return async (dispatch) => {
      return apis.getSnapshot().then(response => {
        if(response.status === 200) {dispatch(setSnapshot(response));}
      });
    };
}

export function getFilteredSnapshotFromBackend(id, query) {
  return async (dispatch) => {
    return apis.getFilteredSnapshot(id, {query: query}).then(response => {
      if(response.status === 200) {dispatch(setSnapshot(response));}
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


//ACTIONS
const setSnapshot = (response) => {
    console.log(response);
    return {
        type: 'SET_SNAPSHOT',
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

const selectFile = (id) => {
  return {
    type: 'SELECT_FILE',
    payload: id
  }
}

const unselectFile = (id) => {
  return {
    type: 'UNSELECT_FILE',
    payload: id
  }
}

export {
  showModal,
  hideModal,
  selectFile,
  unselectFile
}