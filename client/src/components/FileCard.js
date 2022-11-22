import React, {useState} from "react";
import {useDispatch} from "react-redux"
import {selectFile, unselectFile} from "../actions";
import {Accordion, Form} from 'react-bootstrap';
import PermissionElement from './PermissionElement.js'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FileCard(props) {
    const {file, depth, isRoot, staged} = props;
    const dispatch = useDispatch();
    //const selectedFiles = useSelector(state => state.selectedFiles);
    //const [isChecked, setIsChecked] = useState(selectedFiles.some(e => e.id == file.id));
    const [isChecked, setIsChecked] = useState(staged);
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];

    function handleCheck(event) {
        if(isChecked) {
            setIsChecked(false)
            dispatch(unselectFile(file));
        }
        else {
            setIsChecked(true);
            dispatch(selectFile(file));
        }
        event.stopPropagation();
    }

    // Render list of permissions
    //let permissionList = file.permissions.map((element, index) => <p key={index}>{index + 1}. {roles[element.role]}: {(Object.keys(element.granted_to).length !== 0) ? (element.granted_to.email + ", " + element.granted_to.display_name) : (element.driveId)} (id: {element._id})</p>);
    let permissionList = file.permissions.map((element, index) => <PermissionElement key={index} index={index} element={element}/>)

    // Render directory with indents
    let indent = 3*depth;
    let width = 100 - 3*depth;
    let style = {
        marginLeft: indent + '%',
        width: width + '%',
        overflow: 'hidden'
    }
    // Render logo
    let img = null;
    if(isRoot) {
        img = <img src={require('../images/googledrivelogo.png')} style={{height: '18px', marginRight: '10px', }} alt="Google Logo"/>
    }
    else {
        switch (file.mime_type) {
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
                        onChange={() => {}}
                        // checked={isChecked}
                        defaultChecked={staged}
                    />
                    {img}
                    <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        {file.name}
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <p><b>ID:</b> {file.driveId}</p>
                    {file.owner ? <p><b>Owner Name:</b> {file.owner.display_name}</p> : null}
                    {file.owner ?  <p><b>Owner Email:</b> {file.owner.email}</p> : null}
                    <p><b>Date Created:</b> {new Date(file.date_created).toString()}</p>
                    <p><b>Date Modified:</b> {new Date(file.date_modified).toString()}</p>
                    <p><b>Permissions:</b></p>
                    {permissionList}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}