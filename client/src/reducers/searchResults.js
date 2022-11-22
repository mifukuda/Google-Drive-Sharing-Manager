const searchResultsReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_SEARCH_RESULTS':
            return action.payload;
        case 'SORT_BY_NAME':
            return {...state, query_results: state.query_results.slice().sort((a, b) => { return (a.name).localeCompare(b.name); })};
        case 'SORT_BY_DATE_OLD':
            return {...state, query_results: state.query_results.slice().sort((a, b) => { return new Date(b.date_modified) - new Date(a.date_modified); })};
        case 'SORT_BY_DATE_NEW':
            return {...state, query_results: state.query_results.slice().sort((a, b) => { return new Date(a.date_modified) - new Date(b.date_modified); })};
        case 'LOG_OUT':
            return {};
        default:
            return state;
    }
}

export default searchResultsReducer;