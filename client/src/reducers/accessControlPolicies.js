const accessControlPolicyReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_ACCESS_CONTROL_POLICIES':
            return action.payload.data.acps;
        case 'ADD_ACCESS_CONTROL_POLICY':
            let newState = [...state]
            newState.push(action.payload.data.acp)
            return newState
        case 'DELETE_ACCESS_CONTROL_POLICY':
            return state.filter(function(obj) {
                return obj._id !== action.payload;
            });
        case 'LOG_OUT':
            return [];
        default:
            return state;
    }
}

export default accessControlPolicyReducer;