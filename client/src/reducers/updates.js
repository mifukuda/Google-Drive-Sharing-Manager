/*const updatesReducer = (state = {addReaders:[], addWriters:[], addCommenters:[], removeReaders:[], removeWriters:[], removeCommenters:[], unshare:[]}, action) => {
    switch(action.type) {
        case 'PUSH_ADD_READER':
            return {...state, addReaders: [...state.addReaders, action.payload]};
        case 'PULL_ADD_READER':
            return {...state, addReaders: state.addReaders.filter(element => element._id != action.payload._id)};
        case 'PUSH_ADD_WRITER':
            return {...state, addWriters: [...state.addWriters, action.payload]};
        case 'PULL_ADD_WRITER':
            return {...state, addWriters: state.addWriters.filter(element => element._id != action.payload._id)};
        case 'PUSH_ADD_COMMENTER':
            return {...state, addCommenters: [...state.addCommenters, action.payload]};
        case 'PULL_ADD_COMMENTER':
            return {...state, addCommenters: state.addCommenters.filter(element => element._id != action.payload._id)};
        case 'PUSH_UNSHARE':
            return {...state, unshare: [...state.unshared, action.payload]};
        case 'PULL_UNSHARE':
            return {...state, unshare: state.unshare.filter(element => element._id != action.payload._id)};
        case 'PUSH_REMOVE_READER':
            return {...state, removeReaders: [...state.removeReaders, action.payload]};
        case 'PULL_REMOVE_READER':
            return {...state, removeReaders: state.removeReaders.filter(element => element._id != action.payload._id)};
        case 'PUSH_REMOVE_WRITER':
            return {...state, removeWriters: [...state.removeWriters, action.payload]};
        case 'PULL_REMOVE_WRITER':
            return {...state, removeWriters: state.removeWriters.filter(element => element._id != action.payload._id)};
        case 'PUSH_REMOVE_COMMENTER':
            return {...state, removeCommenters: [...state.removeCommenters, action.payload]};
        case 'PULL_REMOVE_COMMENTER':
            return {...state, removeCommenters: state.removeCommenters.filter(element => element._id != action.payload._id)};
        default:
            return state;
    }
}

export default updatesReducer;*/