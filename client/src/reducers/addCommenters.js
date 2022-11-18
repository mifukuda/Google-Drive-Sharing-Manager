const addCommentersReducer = (state = [], action) => {
    switch(action.type) {
        case 'PUSH_ADD_COMMENTER':
            return [...state, action.payload];
        case 'PULL_ADD_COMMENTER':
            return state.filter(element => element !== action.payload);
        default:
            return state;
    }
}

export default addCommentersReducer;