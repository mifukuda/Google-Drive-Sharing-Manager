const showModalReducer = (state = false, action) => {
    switch(action.type) {
        case 'SHOW_MODAL':
            return true;
        case 'HIDE_MODAL':
            return false;
        case 'LOG_OUT':
            return false;
        default:
            return state;
    }
}

export default showModalReducer;