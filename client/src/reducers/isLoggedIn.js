const isLoggedInReducer = (state = false, action) => {
    switch(action.Type) {
        case 'LOG_IN':
            return true;
        case 'LOG_OUT':
            return false;
        default:
            return state;
    }
}

export default isLoggedInReducer;