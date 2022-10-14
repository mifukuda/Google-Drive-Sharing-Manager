import apis from "../api";

export function fetchArticleDetails() {
    return (dispatch) => {
      return apis.getSnapshot().then(response => {
        dispatch(setSnapshot(response));
      });
    };
}

const setSnapshot = (request) => {
    console.log(request);
    return {
        type: 'SET_SNAPSHOT',
        payload: request.data.name
    };
}