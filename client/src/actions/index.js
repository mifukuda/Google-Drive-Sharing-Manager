import apis from "../api";

//THUNKS
export function getSnapshotFromBackend() {
    return (dispatch) => {
      return apis.getSnapshot().then(response => {
        if(response.status === 200) {dispatch(setSnapshot(response));}
      });
    };
}

export function getFilteredSnapshotFromBackend(id, query) {
  return (dispatch) => {
    return apis.getFilteredSnapshot(id, {query: query}).then(response => {
      if(response.status === 200) {dispatch(setSnapshot(response));}
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