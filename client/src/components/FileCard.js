import React from "react";
import {Accordion} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function FileCard(props) {
    const {file, depth} = props;
    // Render directory with indents
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
                <p>ID: {file.id}</p>
                <p>Date Created: {file.date_created}</p>
                <p>Date Modified: {file.date_modified}</p>
                <p>{file.owner ? "Owner: " + file.owner.email : "Owner: Owner info not available for shared drives"}</p>
                <p>{file.creator ? "Creator: " + file.creator.email : "Creator: Owner info not available for shared drives"}</p>
                <p>{file.shared_by ? "Shared by:" + file.shared_by.email : "Shared by: Not available"}</p>
                <p>{"File type: " + file.mimeType}</p>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}