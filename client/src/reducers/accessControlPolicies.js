const accessControlPolicyReducer = (state = [], action) => {
    switch(action.type) {
        case 'SET_ACCESS_CONTROL_POLICIES':
            return action.payload.access_control_policies;
        default:
            return state;
    }
}

export default accessControlPolicyReducer;