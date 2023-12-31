const currentSnapshotReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_SNAPSHOT':
            return action.payload;
        case 'LOG_OUT':
            return {};
        default:
            return state;
    }
}

export default currentSnapshotReducer;