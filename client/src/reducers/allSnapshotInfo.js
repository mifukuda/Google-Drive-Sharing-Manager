const allSnapshotInfoReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_ALL_SNAPSHOT_INFO':
            return action.payload;
        case 'LOG_OUT':
            return [];
        default:
            return state;
    }
}

export default allSnapshotInfoReducer;