const addCommentersReducer = (state = [], action) => {
    switch(action.type) {
        case 'PUSH_ADD_COMMENTER':
            return [...state, action.payload];
        case 'PULL_ADD_COMMENTER':
            return state.filter(element => element !== action.payload);
        case 'CLEAR_UPDATE_SCREEN':
            return [];
        default:
            return state;
    }
}

export default addCommentersReducer;