import React, {useState} from "react";
import {useSelector} from 'react-redux';
import {getGroupMembers} from '../api/group.js';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default function PermissionElement(props) {
    const {index, element} = props;
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];
    const currentSnapshot = useSelector(state => state.currentSnapshot);
    const [group, setGroup] = useState();
    const [body, setBody] = useState(<p>You have not uploaded a snapshot for this group yet</p>);

    function handleGetGroup(groupName) {
        if(group === undefined) {
            getGroupMembers({snapshot_id: currentSnapshot._id, group_name: groupName}).then(response => {
                if(response.status === 200) {
                    console.log(response.data);
                    setGroup(response.data.members);
                    setBody();
                }
            });
        }
    }

    let permissionElement = null;
    if(element.granted_to.type === 'group') {
        let popover = (
            <Popover id="popover-basic">
                <Popover.Header as="h3">{element.granted_to.email}</Popover.Header>
                <Popover.Body>
                    {body}
                </Popover.Body>
            </Popover>
        );
        let trigger = (
            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                <a href="#" onClick={() => handleGetGroup()}>{element.granted_to.email + ", " + element.granted_to.display_name}</a>
            </OverlayTrigger>
        );
        permissionElement = <p>{index + 1}. {roles[element.role]}: {(Object.keys(element.granted_to).length !== 0) ? trigger : (element.driveId)} (id: {element._id})</p>
    }
    else {
        permissionElement = <p>{index + 1}. {roles[element.role]}: {(element.driveId !== 'anyoneWithLink') ? (element.granted_to.email + ", " + element.granted_to.display_name) : (element.driveId)} (id: {element._id})</p>
    }

    return (
        permissionElement
    );
}