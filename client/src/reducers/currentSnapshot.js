const currentSnapshotReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_SNAPSHOT':
            return action.payload;
        case 'SORT_BY_NAME':
            return {...state, files: state.files.slice().sort((a, b) => { return (a.name).localeCompare(b.name); })};
        case 'SORT_BY_DATE_OLD':
            return {...state, files: state.files.slice().sort((a, b) => { return new Date(b.date_modified) - new Date(a.date_modified); })};
        case 'SORT_BY_DATE_NEW':
            return {...state, files: state.files.slice().sort((a, b) => { return new Date(a.date_modified) - new Date(b.date_modified); })};
        default:
            return state;
    }
}

export default currentSnapshotReducer;