const removeWritersReducer = (state = [], action) => {
    switch(action.type) {
        case 'PUSH_REMOVE_WRITER':
            return [...state, action.payload];
        case 'PULL_REMOVE_WRITER':
            return state.filter(element => element !== action.payload);
        case 'CLEAR_UPDATE_SCREEN':
            return [];
        default:
            return state;
    }
}

export default removeWritersReducer;