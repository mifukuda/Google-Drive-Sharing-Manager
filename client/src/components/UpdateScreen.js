import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {stageFiles, clearUpdateScreen} from "../actions";
import StagedFileList from './StagedFileList';
import PermissionAdder from './PermissionAdder';
import {Button, Form} from 'react-bootstrap';
import {updatePermissions} from '../api';

export default function UpdateScreen() {
    let navigate = useNavigate();
    const currentSnapshot = useSelector(state => state.currentSnapshot);
    const selectedFiles = useSelector(state => state.selectedFiles);
    const addReaders = useSelector(state => state.addReaders);
    const addWriters = useSelector(state => state.addWriters);
    const addCommenters = useSelector(state => state.addCommenters);
    const removeReaders = useSelector(state => state.removeReaders);
    const removeWriters = useSelector(state => state.removeWriters);
    const removeCommenters = useSelector(state => state.removeCommenters);
    const [unshare, setUnshare] = useState(false);
    const dispatch = useDispatch();

    //Stage files
    useEffect(() => {
        dispatch(stageFiles(selectedFiles));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Navigate to home page when close button is pressed
    function handleClose(event) {
        dispatch(clearUpdateScreen());
        navigate("/home");
    }

    function handleChangeUnshare() {
        setUnshare(!unshare);
    }

    // Submit updates
    async function handleSubmit() {
        // Map of operations to list of user-provided emails
        const operations = {"add_readers": addReaders, 
            "add_writers": addWriters, 
            "add_commenters": addCommenters, 
            "remove_readers": removeReaders, 
            "remove_writers": removeWriters, 
            "remove_commenters": removeCommenters
        }  
        // Get file ID's for backend request
        const ids =  selectedFiles.map(file => file._id);
        for (const [operation, emails] of Object.entries(operations)) {
            // No emails provided
            if (emails.length === 0) {
                continue;
            }
            let body = {
                snapshotID: currentSnapshot._id,
                fileDbIDs: ids, 
                operation: operation,
                emails: emails 
            }
            console.log(body);
            // await - MongoDB version control 
            let response = await updatePermissions(body);
            console.log(response);
        }
        if(unshare) {
            let unshareResponse = await updatePermissions({
                snapshotID: currentSnapshot._id,
                fileDbIDs: ids, 
                operation: "unshare",
                emails: [] 
            });
            console.log(unshareResponse);
        }
    }

    return (
        <div className="analyzescreen">
            <div className="analyzescreenheader">
                <h1 className="analyzescreenheadertitle">Update Sharing &#128275;</h1>
                <div className="analyzescreenheaderbutton">
                    <input className="exitbutton" type="image" src={require('../images/closebutton.png')} alt="close button" style={{height: "40px"}}
                        onClick={(event) => handleClose(event)}/>
                </div>
            </div>
            <div className="analyzescreencenter">
                <h2 className="analyzescreensubtitle">Staged Files &#128194;</h2>
                <div className="updatescreenlist">
                    <StagedFileList/>
                </div>
                <h2 className="analyzescreensubtitle">Add and Remove Permissions &#128101;</h2>
                <div className="permissionadders">
                    <PermissionAdder users={addWriters} addType="PUSH_ADD_WRITER" removeType="PULL_ADD_WRITER" role="Add Writers"/>
                    <hr className="updatescreenbreak"/>
                    <PermissionAdder users={removeWriters} addType="PUSH_REMOVE_WRITER" removeType="PULL_REMOVE_WRITER" role="Remove Writers"/>
                    <hr className="updatescreenbreak"/>
                    <PermissionAdder users={addReaders} addType="PUSH_ADD_READER" removeType="PULL_ADD_READER" role="Add Readers"/>
                    <hr className="updatescreenbreak"/>
                    <PermissionAdder users={removeReaders} addType="PUSH_REMOVE_READER" removeType="PULL_REMOVE_READER" role="Remove Readers"/>
                    <hr className="updatescreenbreak"/>
                    <PermissionAdder users={addCommenters} addType="PUSH_ADD_COMMENTER" removeType="PULL_ADD_COMMENTER" role="Add Commenters"/>
                    <hr className="updatescreenbreak"/>
                    <PermissionAdder users={removeCommenters} addType="PUSH_REMOVE_COMMENTER" removeType="PULL_REMOVE_COMMENTER" role="Remove Commenters"/>
                    <hr className="updatescreenbreak"/>
                    <div className="permissionadder">
                        <Form.Check 
                            type='checkbox'
                            label='Unshare files.'
                            checked={unshare}
                            onChange={() => handleChangeUnshare()}
                        />
                    </div>
                    <hr className="updatescreenbreak"/>
                </div>
                <div className="updatescreenoptions">
                    <Button style={{marginRight:"2%", padding:"1%"}} variant="secondary" onClick={(event) => handleClose(event)}>Cancel</Button>
                    <Button style={{padding:"1%"}} onClick={() => handleSubmit()}>Submit Changes</Button>
                </div>
            </div>
        </div>
    );
}