const stagedFilesReducer = (state = [], action) => {
    switch(action.type) {
        case 'STAGE_FILES':
            return [...action.payload];
        case 'CLEAR_UPDATE_SCREEN':
            return [];
        case 'LOG_OUT':
            return [];
        default:
            return state;
    }
}

export default stagedFilesReducer;