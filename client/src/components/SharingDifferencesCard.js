import React from "react";
import {Card, Container, Row, Col} from "react-bootstrap";

export default function SharingDifferencesCard(props) {
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];
    let {parent, child} = props
    let parentPermissions = parent.permissions.map((element, index) => <p key={index}>{index + 1}. {element.granted_to.email}, {element.granted_to.display_name} ({roles[element.role]})</p>);
    parentPermissions.unshift(<p><b>Parent Permissions</b></p>);
    let childPermissions = child.permissions.map((element, index) => <p key={index}>{index + 1}. {element.granted_to.email}, {element.granted_to.display_name} ({roles[element.role]})</p>);
    childPermissions.unshift(<p><b>Child Permissions</b></p>);
    return (
        <Card style={{padding:"2%"}}>
            <Card.Title>File: {parent.name}/{child.name}</Card.Title>
            <Card.Body>
                <Container>
                    <Row>
                        <Col>{parentPermissions}</Col>
                        <Col>{childPermissions}</Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}