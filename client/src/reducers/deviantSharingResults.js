const deviantSharingResultsReducer = (state = {}, action) => {
    switch(action.type) {
        case 'SET_DEVIANT_SHARING_RESULTS':
            return action.payload;
        default:
            return state;
    }
}

export default deviantSharingResultsReducer;