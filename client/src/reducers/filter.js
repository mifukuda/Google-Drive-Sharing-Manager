const filterReducer = (state = '', action) => {
    switch(action.type) {
        case 'SET_SNAPSHOT':
            return action.payload.filter;
        case 'SET_SEARCH_RESULTS':
            return action.payload.filter;
        case 'SET_FILTER':
            return action.payload;
        default:
            return state;
    }
}

export default filterReducer;