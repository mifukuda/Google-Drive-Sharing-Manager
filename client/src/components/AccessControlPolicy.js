import { Accordion, Button, Card, Container, Row, Col } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { deleteAccessControlPolicyFromBackend } from "../actions"

export default function AccessControlPolicy({ access_control_policy }) {
    const dispatch = useDispatch();
    const { _id, name, query, AW, AR, DR, DW } = access_control_policy

    function handleDelete() {
        dispatch(deleteAccessControlPolicyFromBackend(_id));
    }

    return (
        <Accordion>
            <Accordion.Item eventKey={_id}>
                <Accordion.Header>
                    <b>Policy: {_id}</b>
                    <Button style={{marginLeft: '2%'}} className="float-right" onClick={() => handleDelete()}>Delete</Button>
                </Accordion.Header>
                <Accordion.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Query</Card.Title>
                                    <Card.Text>{query}</Card.Text>
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Allowed Writers</Card.Title>
                                    {AW.map(u => 
                                        <Card.Text>Email: {u}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Allowed Readers</Card.Title>
                                    {AR.map(u => 
                                        <Card.Text>Email: {u}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Denied Writers</Card.Title>
                                    {DW.map(u => 
                                        <Card.Text>Email: {u}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Denied Readers</Card.Title>
                                    {DR.map(u => 
                                        <Card.Text>Email: {u}</Card.Text>
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