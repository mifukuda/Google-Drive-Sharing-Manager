import React, {useState} from "react";
import { Link } from "react-router-dom";
import SnapshotSelector from './SnapshotSelector'
import {useDispatch} from "react-redux";
import {createSnapshotInBackend} from "../actions";
import {uploadGroupSnapshot} from "../api/group.js";

// Tutorial for uploading files from: https://www.filestack.com/fileschool/react/react-file-upload/
// Put links for take snapshot, compare snapshot, manage policy requirements
export default function SideBar() {
    const dispatch = useDispatch();
    const [file, setFile] = useState();
    
    function handleTakeSnapshot() {
        console.log("Creating a new snapshot.")
        dispatch(createSnapshotInBackend());
    }

    function handleSelectFile(event) {
        setFile(event.target.files[0]);
    }

    function handleUploadGroup() {
        if(!file) return;
        const formData = new FormData();
        formData.append('memberlist', file);
        formData.append('name', file.name);
        uploadGroupSnapshot(formData).then((response) => {
            console.log(response.data);
        });
    }

    return (
        <div className="sidebar">
            <div className="sidebar1">
                <h2 className="sidebarlogo">The</h2>
                <h1 className="sidebarlogo">Microservices</h1>
                <h2 className="sidebarlogo">Drive Sharing Manager</h2>
                <h3 className="sidebarlogo" style={{marginTop:"8%"}}>Snapshots:</h3>
                <button className="sidebarbutton" onClick={() => handleTakeSnapshot()}>+ New Snapshot</button>
                <SnapshotSelector/>
            </div>
            <div className="sidebar2">
                <h3 className="sidebarlogo">Upload Group Snapshot:</h3>
                <input type="file" onChange={(event) => handleSelectFile(event)}/>
                <button className="uploadbutton" onClick={() => handleUploadGroup()}>+ Upload Group</button>
                <h3 className="sidebarlogo">On Selected:</h3>
                <ul>
                    <li>
                        <Link to="/analyze" className="sidebar2link">Analyze Sharing</Link>
                    </li>
                    <li>
                        <Link to="/update" className="sidebar2link">Update Permissions</Link>
                    </li>
                    <li>
                        <Link to="/accessControlPolicies" className="sidebar2link">Manage Access Control Policies</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}