import { useEffect, useState } from "react";
import { Accordion, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export default function AccessControlPolicy({ access_control_policy }) {
    const [editMode, setEditMode] = useState(false)

    return (
        <Accordion>
            <Accordion.Item eventKey={access_control_policy.id}>
                <Accordion.Header>
                    <b>Policy Name: {access_control_policy.name} Query: {access_control_policy.query}</b>
                    <Button onClick={() => setEditMode(prevstate => !prevstate)}>{editMode ? "Save" : "Edit"}</Button>
                </Accordion.Header>
                <Accordion.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Allowed Writers</Card.Title>
                                    {access_control_policy.AW.map(u => 
                                        <Card.Text>Email: {u.email}, Display Name: {u.display_name}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Allowed Readers</Card.Title>
                                    {access_control_policy.AR.map(u => 
                                        <Card.Text>Email: {u.email}, Display Name: {u.display_name}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Denied Writers</Card.Title>
                                    {access_control_policy.DW.map(u => 
                                        <Card.Text>Email: {u.email}, Display Name: {u.display_name}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Denied Readers</Card.Title>
                                    {access_control_policy.DR.map(u => 
                                        <Card.Text>Email: {u.email}, Display Name: {u.display_name}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                        </Row>
                    </Container>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}