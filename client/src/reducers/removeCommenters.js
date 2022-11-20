const removeCommentersReducer = (state = [], action) => {
    switch(action.type) {
        case 'PUSH_REMOVE_COMMENTER':
            return [...state, action.payload];
        case 'PULL_REMOVE_COMMENTER':
            return state.filter(element => element !== action.payload);
        case 'CLEAR_UPDATE_SCREEN':
            return [];
        default:
            return state;
    }
}

export default removeCommentersReducer;