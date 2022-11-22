const addWritersReducer = (state = [], action) => {
    switch(action.type) {
        case 'PUSH_ADD_WRITER':
            return [...state, action.payload];
        case 'PULL_ADD_WRITER':
            return state.filter(element => element !== action.payload);
        case 'CLEAR_UPDATE_SCREEN':
            return [];
        case 'LOG_OUT':
            return [];
        default:
            return state;
    }
}

export default addWritersReducer;