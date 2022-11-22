const compareSnapshotResultsReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_COMPARE_SNAPSHOT_RESULTS':
            return action.payload;
        case "CLEAR_COMPARE_SCREEN":
            return {};
        case 'LOG_OUT':
            return {};
        default:
            return state;
    }
}

export default compareSnapshotResultsReducer;