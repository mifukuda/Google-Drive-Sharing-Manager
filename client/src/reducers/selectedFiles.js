const selectedFilesReducer = (state = [], action) => {
    switch(action.type) {
        case 'SELECT_FILE':
            return [...state, action.payload]
        case 'UNSELECT_FILE':
            return state.filter(element => element._id != action.payload._id);
        case 'CLEAR_UPDATE_SCREEN':
            return [];
        case 'LOG_OUT':
            return [];
        default:
            return state;
    }
}

export default selectedFilesReducer;