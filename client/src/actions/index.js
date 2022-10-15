import apis from "../api";

export function getSnapshotFromBackend() {
    return (dispatch) => {
      return apis.getSnapshot().then(response => {
        dispatch(setSnapshot(response));
      });
    };
}

export function getFilteredSnapshotFromBackend(id, query) {
  return (dispatch) => {
    return apis.getFilteredSnapshot(id, {query: query}).then(response => {
      dispatch(setSnapshot(response));
    });
  };
}

const setSnapshot = (response) => {
    console.log(response);
    return {
        type: 'SET_SNAPSHOT',
        payload: response.data
    };
}