import React from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default function PermissionElement(props) {
    const {index, element} = props;
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];

    let permissionElement = null;
    if(element.granted_to.type === 'group') {
        let popover = (
            <Popover id="popover-basic">
                <Popover.Header as="h3">{element.granted_to.email}</Popover.Header>
                <Popover.Body>
                    This is a group.
                </Popover.Body>
            </Popover>
        );
        let trigger = (
            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                <a href="#">{element.granted_to.email + ", " + element.granted_to.display_name}</a>
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