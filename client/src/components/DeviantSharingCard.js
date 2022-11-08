import React from "react";
import {Card, Container, Row, Col} from "react-bootstrap";

export default function DeviantSharingCard(props) {
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];
    let {majorityPermissions, deviantFile} = props
    let deviantPermissions = deviantFile.permissions.map((element, index) => <p key={index}>{index + 1}. {element.granted_to.email}, {element.granted_to.display_name} ({roles[element.role]})</p>);
    deviantPermissions.unshift(<p><b>Deviant Permissions</b></p>);
    return (
        <Card style={{padding:"2%"}}>
            <Card.Title>File: {deviantFile.source}/{deviantFile.name}</Card.Title>
            <Card.Body>
                <Container>
                    <Row>
                        <Col>{majorityPermissions}</Col>
                        <Col>{deviantPermissions}</Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}