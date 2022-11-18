const stagedFilesReducer = (state = [], action) => {
    switch(action.type) {
        case 'STAGE_FILES':
            return [...action.payload];
        default:
            return state;
    }
}

export default stagedFilesReducer;