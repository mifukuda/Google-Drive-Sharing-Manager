import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccessControlPoliciesFromBackend } from "../actions";
import apis from '../api';
import { Button } from "react-bootstrap";
import AccessControlPolicy from "./AccessControlPolicy";
import AddPolicy from "./AddPolicy";

export default function AccessControlPolicies(props) {
    const dispatch = useDispatch()
    const access_control_policies = useSelector(state => state.accessControlPolicies)
    const currentSnapshot = useSelector(state => state.currentSnapshot)
    const [addMode, setAddMode] = useState(false)
    const [results, setResults] = useState([])

    useEffect(() => {
        dispatch(getAccessControlPoliciesFromBackend())
    }, [])

    async function handleClick() {
        let acp_ids = access_control_policies.map(element => element._id)
        console.log({snapshot_id: currentSnapshot._id, acp_ids: acp_ids});
        let response = await apis.checkSnapshot({snapshot_id: currentSnapshot._id, acp_ids: acp_ids});
        console.log(response);
        if (response.status === 200) {
            setResults(response.data);
        }
    }

    let violations = null;
    if(results.length !== 0) {
        console.log(results);
        let acpViolations = []
        for(let i = 0; i < results.length; i++) {
            let violationList = results[i].violations.map((element, index) => <li key={index}></li>)
            let name = <p>{i+1}. {results[i].id}</p>
            let acpViolation = <div key={i}>{name} <ul>{violationList}</ul></div>
            acpViolations.push(acpViolation);
        }
        violations = acpViolations;
    }

    return (
        <div>
            <h3>
                Access control policy page (current snapshot: {new Date(currentSnapshot.date_created).toLocaleString("en-US", {timeZone: "America/New_York"})})
                <Button style={{marginLeft: '2%'}} onClick={() => handleClick()}>Check Snapshot with Policies</Button>
            </h3>
            <div>
                {violations}
            </div>
            {access_control_policies.map(policy => <AccessControlPolicy access_control_policy={policy} />)}
            {!addMode ? <Button onClick={() => setAddMode(true)}>Add</Button> : null}
            {addMode ? <AddPolicy setAddMode={setAddMode} /> : null}
        </div>
    )
}