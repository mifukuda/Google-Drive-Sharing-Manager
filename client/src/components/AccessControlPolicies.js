import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccessControlPoliciesFromBackend } from "../actions";
import { Button } from "react-bootstrap";
import AccessControlPolicy from "./AccessControlPolicy";
import AddPolicy from "./AddPolicy";

export default function AccessControlPolicies(props) {
    const dispatch = useDispatch()
    const access_control_policies = useSelector(state => state.accessControlPolicies)
    const [addMode, setAddMode] = useState(false)

    useEffect(() => {
        dispatch(getAccessControlPoliciesFromBackend())
    }, [])

    return (
        <div>
            <h3>
                Access control policy page
            </h3>
            {access_control_policies.map(policy => <AccessControlPolicy access_control_policy={policy} />)}
            {!addMode ? <Button onClick={() => setAddMode(true)}>Add</Button> : null}
            {addMode ? <AddPolicy setAddMode={setAddMode} /> : null}
        </div>
    )
}