import React from "react";
import {useNavigate} from "react-router-dom";
import {Modal, Button} from 'react-bootstrap';

// Button redirects to Google Auth
export default function UpdateStatusModal(props) {
    const {status, show, setShow} = props;

    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show}>
            <Modal.Header>
                <Modal.Title>Update Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {status}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(!show)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}