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

export function addAccessControlPolicyToBackend() {
  return async (dispatch) => {
    return apis.addAccessControlPolicy().then(response => {
      if(response.status === 200) {dispatch(addAccessControlPolicy(response));}
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

const addAccessControlPolicy = (response) => {
    console.log(response);
    return {
      type: 'ADD_ACCESS_CONTROL_POLICY',
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

export {
  showModal,
  hideModal,
  selectFile,
  unselectFile
}