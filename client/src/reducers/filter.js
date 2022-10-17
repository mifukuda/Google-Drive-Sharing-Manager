const filterReducer = (state = '', action) => {
    switch(action.type) {
        case 'SET_SNAPSHOT':
            return action.payload.filter;
        default:
            return state;
    }
}

export default filterReducer;