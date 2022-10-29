import React from "react";
import {Accordion, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FileCard(props) {
    const {file, depth, isRoot} = props;

    function handleCheck(event) {
        console.log("HELLO WORD");
        event.stopPropagation();
    }

    // Render directory with indents
    let indent = 3*depth;
    let width = 100 - 3*depth;
    let style = {
        marginLeft: indent + '%',
        width: width + '%'
    }
    // Render logo
    let img = null;
    if(isRoot) {
        img = <img src={require('../images/googledrivelogo.png')} style={{height: '18px', marginRight: '10px', }} alt="Google Logo"/>
    }
    else {
        switch (file.mimeType) {
            case "application/vnd.google-apps.spreadsheet":
                img = <img src={require('../images/googlesheetslogo.png')} style={{height: '18px', marginRight: '10px', }} alt="Google Sheets Logo"/>
                break;
            case "application/vnd.google-apps.document":
                img = <img src={require('../images/googledocslogo.png')} style={{height: '18px', marginRight: '10px', }} alt="Google Docs Logo"/>
                break;
            case "application/vnd.google-apps.presentation":
                img = <img src={require('../images/googleslideslogo.png')} style={{height: '18px', marginRight: '10px', }} alt="Google Slides Logo"/>
                break;
            case "application/vnd.google-apps.folder":
                img = <img src={require('../images/folder.png')} style={{height: '18px', marginRight: '10px', }} alt="Folder Logo"/>
                break;
            default:
                img = <img src={require('../images/file.png')} style={{height: '18px', marginRight: '10px', }} alt="File Logo"/>
        }
    }
    
    return (
        <Accordion style={style}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <Form.Check
                        type="checkbox"
                        id="checkbox"
                        style={{marginRight:"16px"}}
                        onClick={(event) => handleCheck(event)}
                    />
                    {img}
                    <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        {file.name}
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                <p>ID: {file.id}, Date Created: {file.date_created}, Date Modified: {file.date_modified}</p>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}