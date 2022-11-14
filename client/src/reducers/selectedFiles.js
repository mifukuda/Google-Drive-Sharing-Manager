const selectedFilesReducer = (state = [], action) => {
    switch(action.type) {
        case 'SELECT_FILE':
            return [...state, action.payload]
        case 'UNSELECT_FILE':
            return state.filter(element => element._id != action.payload._id);
        default:
            return state;
    }
}

export default selectedFilesReducer;