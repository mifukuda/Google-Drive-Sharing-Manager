const sharingDifferencesResultsReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_SHARING_DIFFERENCES_RESULTS':
            return action.payload;
        case "CLEAR_ANALYZE_SCREEN":
            return {};
        default:
            return state;
    }
}

export default sharingDifferencesResultsReducer;