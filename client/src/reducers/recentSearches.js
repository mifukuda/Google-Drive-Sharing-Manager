const recentSearchesReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_RECENT_SEARCHES':
            return action.payload
        default:
            return state;
    }
}

export default recentSearchesReducer;