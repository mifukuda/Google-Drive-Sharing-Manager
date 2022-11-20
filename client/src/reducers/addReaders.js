const addReadersReducer = (state = [], action) => {
    switch(action.type) {
        case 'PUSH_ADD_READER':
            return [...state, action.payload];
        case 'PULL_ADD_READER':
            return state.filter(element => element !== action.payload);
        case 'CLEAR_UPDATE_SCREEN':
            return [];
        default:
            return state;
    }
}

export default addReadersReducer;