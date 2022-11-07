const allSnapshotInfoReducer = (state = [{_id: 'Charles', createdAt: "Yesterday", updatedAt: "Today", files: null}, {_id: 'Kevin', createdAt: "3 Days Ago", updatedAt: "Yesterday", files: null}, {_id: 'Joe', createdAt: "5 Days Ago", updatedAt: "Yesterday", files: null}], action) => {
    switch(action.type) {
        case 'SET_ALL_SNAPSHOT_INFO':
            return action.payload;
        default:
            return state;
    }
}

export default allSnapshotInfoReducer;