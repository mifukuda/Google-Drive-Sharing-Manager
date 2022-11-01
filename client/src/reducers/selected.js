const selectedReducer = (state = [], action) => {
    switch(action.type) {
        case 'SELECT_FILE':
            return [...state, action.payload]
        case 'UNSELECT_FILE':
            return state.filter(element => element !== action.payload);
        default:
            return state;
    }
}

export default selectedReducer;