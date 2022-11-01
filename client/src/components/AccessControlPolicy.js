import { Accordion, Button, Card, Container, Row, Col } from "react-bootstrap";

export default function AccessControlPolicy({ access_control_policy }) {
    const { id, name, query, AW, AR, DR, DW } = access_control_policy

    return (
        <Accordion>
            <Accordion.Item eventKey={id}>
                <Accordion.Header>
                    <b>Policy Name: {name}</b>
                    <Button className="float-right">Delete</Button>
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
                                        <Card.Text>Email: {u.email}, Display Name: {u.display_name}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Allowed Readers</Card.Title>
                                    {AR.map(u => 
                                        <Card.Text>Email: {u.email}, Display Name: {u.display_name}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Denied Writers</Card.Title>
                                    {DW.map(u => 
                                        <Card.Text>Email: {u.email}, Display Name: {u.display_name}</Card.Text>
                                    )}
                                </Card.Body>
                            </Col>
                            <Col>
                                <Card.Body>
                                    <Card.Title>Denied Readers</Card.Title>
                                    {DR.map(u => 
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