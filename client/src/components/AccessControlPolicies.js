import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccessControlPoliciesFromBackend } from "../actions";
import AccessControlPolicy from "./AccessControlPolicy";

export default function AccessControlPolicies(props) {
    const dispatch = useDispatch()
    const access_control_policies = useSelector(state => state.access_control_policies)

    useEffect(() => {
        dispatch(getAccessControlPoliciesFromBackend())
    }, [])

    return (
        <div>
            <h1>
                Access control policy page
            </h1>
            {this.access_control_policies.map(policy => <AccessControlPolicy props={policy} />)}
        </div>
    )
}