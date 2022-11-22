const unshareReducer = (state = [], action) => {
    switch(action.type) {
        case 'PUSH_UNSHARE':
            return [...state, action.payload];
        case 'PULL_UNSHARE':
            return state.filter(element => element !== action.payload);
        case 'CLEAR_UPDATE_SCREEN':
            return [];
        case 'LOG_OUT':
            return [];
        default:
            return state;
    }
}

export default unshareReducer;