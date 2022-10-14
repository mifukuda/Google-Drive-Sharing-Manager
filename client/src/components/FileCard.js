import React from "react";
import {Accordion} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FileCard(props) {
    const {file, depth} = props;
    let indent = 2*depth;
    let width = 100 - 2*depth;
    let style = {
        marginLeft: indent + '%',
        width: width + '%'
    }
    return (
        <Accordion style={style}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{file.name}</Accordion.Header>
                <Accordion.Body>
                <p>ID: {file.id}, Date Created: {file.date_created}, Date Modified: {file.date_modified}</p>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}