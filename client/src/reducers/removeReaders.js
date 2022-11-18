const removeReadersReducer = (state = [], action) => {
    switch(action.type) {
        case 'PUSH_REMOVE_READER':
            return [...state, action.payload];
        case 'PULL_REMOVE_READER':
            return state.filter(element => element !== action.payload);
        default:
            return state;
    }
}

export default removeReadersReducer;