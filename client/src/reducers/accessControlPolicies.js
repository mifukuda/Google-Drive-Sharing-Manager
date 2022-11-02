const accessControlPolicyReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_ACCESS_CONTROL_POLICIES':
            return action.payload.access_control_policies;
        case 'ADD_ACCESS_CONTROL_POLICY':
            let newState = [...state]
            newState.push(action.payload)
            return newState
        default:
            return state;
    }
}

export default accessControlPolicyReducer;