const showCompareModalReducer = (state = false, action) => {
    switch(action.type) {
        case 'SHOW_COMPARE_MODAL':
            return true;
        case 'HIDE_COMPARE_MODAL':
            return false;
        default:
            return state;
    }
}

export default showCompareModalReducer;