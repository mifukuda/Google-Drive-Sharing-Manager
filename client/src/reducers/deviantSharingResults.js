const deviantSharingResultsReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_DEVIANT_SHARING_RESULTS':
            return action.payload;
        case "CLEAR_ANALYZE_SCREEN":
            return {};
        case 'LOG_OUT':
            return {};
        default:
            return state;
    }
}

export default deviantSharingResultsReducer;