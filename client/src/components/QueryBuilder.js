import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux"
import {getFilteredSnapshotFromBackend, hideModal} from "../actions";
import {Modal, Button, Dropdown, Container, Row, Col, Form, Card} from 'react-bootstrap';


export default function QueryBuilder() {
    const dispatch = useDispatch();
    const showModal = useSelector(state => state.showModal);
    const currentSnapshot = useSelector(state => state.currentSnapshot);
    const [operatorSelection, setOperatorSelection] = useState("drive:");
    const [searchTerm, setSearchTerm] = useState("");
    const [queries, setQueries] = useState([]);

    // Make query builder invisible and reset state
    function handleHideModal(event) {
        setOperatorSelection("drive:");
        setSearchTerm("");
        setQueries([]);
        dispatch(hideModal());
    }

    // Update dropdown menu to display selected operator
    function handleUpdateDisplay(operator) {
        setOperatorSelection(operator);
        return false;
    }
    
    // Add query to query list when user presses 'Enter'
    function handleSubmit(event) {
        if(event.key === 'Enter') {
            event.preventDefault();
            handleAddQuery();
        } 
    }

    // Add query to list
    function handleAddQuery() {
        let newQuery = operatorSelection + searchTerm;
        setQueries(oldArray => [...oldArray, newQuery]);
    }

    // Delete query from list
    function handleDelete(query) {
        setQueries(queries.filter(item => item !== query));
    }

    // Submit search
    function handleSearch() {
        if (queries.length === 0) {
            return;
        }
        handleHideModal();
        let queryString = queries.join('&');
        dispatch(getFilteredSnapshotFromBackend(currentSnapshot._id, queryString));
    }

    // List of operators to be displayed
    const dropdownActions = ["drive:", "owner:", "creator:", "from:", "to:", "readable:", 
        "writable:", "sharable:", "name:", "folder:", "path:", "sharing:"]
        .map((x, i) => <Dropdown.Item key={i} onClick={(event) => handleUpdateDisplay(x)}>{x}</Dropdown.Item>);
    // Map queries to cards w/ delete button
    const queryList = queries.map((x, i) => 
        <Card key={i}>
            <Card.Body style={{fontSize:"1.3em"}}>
                <Container>
                    <Row>
                        <Col xs={15} md={10}>
                            {i+1}. "{x}"
                        </Col>
                        <Col xs={3} md={2}>
                            <Button variant="danger" onClick={(event) => handleDelete(x)}>Delete</Button>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>);

    return (
        <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showModal}>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1>Query Builder &#128270;</h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{padding:"4%"}}>
                <Container>
                    <Row style={{marginBottom: '20px'}}>
                        <Col xs={4} md={2}>
                            <Dropdown>
                                <Dropdown.Toggle style={{width: '100%'}} variant="primary" id="dropdown-basic">
                                    {operatorSelection}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {dropdownActions}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs={12} md={9}>
                            {/*Search bar; on change, update searchTerm; on key press, check for enter*/}
                            <Form>
                                <Form.Group controlId="formBuilderBar">
                                    <Form.Control placeholder="Type in search term..." 
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        onKeyPress={(event) => handleSubmit(event)}/>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={2} md={1}>
                            {/*Button for adding query to list.*/}
                            <Button variant="success" onClick={(event) => handleAddQuery()}>+</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={18} md={12}>
                            <div className="querybuilderlist">
                                {queryList}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={(event) => handleSearch()}>Search</Button>
                <Button variant="secondary" onClick={(event) => handleHideModal(event)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
    }