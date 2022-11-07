const allSnapshotInfoReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_ALL_SNAPSHOT_INFO':
            return action.payload;
        default:
            return state;
    }
}

export default allSnapshotInfoReducer;