const filterReducer = (state = '', action) => {
    switch(action.type) {
        case 'SET_SNAPSHOT':
            return '';
        case 'SET_SEARCH_RESULTS':
            return action.payload.query;
        case 'SET_FILTER':
            return action.payload;
        default:
            return state;
    }
}

export default filterReducer;