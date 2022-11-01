import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccessControlPoliciesFromBackend } from "../actions";
import AccessControlPolicy from "./AccessControlPolicy";

export default function AccessControlPolicies(props) {
    const dispatch = useDispatch()
    const access_control_policies = useSelector(state => state.accessControlPolicies)

    useEffect(() => {
        dispatch(getAccessControlPoliciesFromBackend())
    }, [])

    return (
        <div>
            <h1>
                Access control policy page
            </h1>
            {access_control_policies.map(policy => <AccessControlPolicy access_control_policy={policy} />)}
        </div>
    )
}