import React from "react";
import {Card, Container, Row, Col} from "react-bootstrap";

export default function CompareSnapshotCard(props) {
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];
    const {oldPermissions, newPermissions, file} = props;

    // New Permissions = Snapshot 2 Permissions
    let newPermissionList = newPermissions.map((element, index) => <p key={index+1}>{index + 1}. {element.granted_to.email}, {element.granted_to.display_name} ({roles[element.role]})</p>);
    newPermissionList.unshift(<p key={0}><b>Snapshot 2 Permissions</b></p>);
    if(newPermissionList.length === 0) {
        newPermissionList.push(<p key={1}>N/A</p>);
    }

    // Old Permissions = Snapshot 1 Permissions
    let oldPermissionList = oldPermissions.map((element, index) => <p key={index+1}>{index + 1}. {element.granted_to.email}, {element.granted_to.display_name} ({roles[element.role]})</p>);
    if(oldPermissionList.length === 0) {
        oldPermissionList.push(<p key={1}>N/A</p>);
    }
    oldPermissionList.unshift(<p key={0}><b>Snapshot 1 Permissions</b></p>);

    return (
        <Card style={{padding:"2%"}}>
            <Card.Title>File: {file.name}</Card.Title>
            <Card.Body>
                <Container>
                    <Row>
                        <Col>{oldPermissionList}</Col>
                        <Col>{newPermissionList}</Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}