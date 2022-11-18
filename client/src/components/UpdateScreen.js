import React, {useEffect} from "react";
// import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {stageFiles} from "../actions";
import StagedFileList from './StagedFileList';
import PermissionAdder from './PermissionAdder';

export default function UpdateScreen() {
    let navigate = useNavigate();
    const selectedFiles = useSelector(state => state.selectedFiles);
    const addReaders = useSelector(state => state.addReaders);
    const addWriters = useSelector(state => state.addWriters);
    const addCommenters = useSelector(state => state.addCommenters);
    const removeReaders = useSelector(state => state.removeReaders);
    const removeWriters = useSelector(state => state.removeWriters);
    const removeCommenters = useSelector(state => state.removeCommenters);
    const unshare = useSelector(state => state.unshare);
    const dispatch = useDispatch();

    //Stage files
    useEffect(() => {
        dispatch(stageFiles(selectedFiles));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Navigate to home page when close button is pressed
    function handleClose(event) {
        navigate("/home");
    }

    return (
        <div className="analyzescreen">
            <div className="analyzescreenheader">
                <h1 className="analyzescreenheadertitle">Update Sharing &#128275;</h1>
                <input className="exitbutton" type="image" src={require('../images/closebutton.png')} alt="close button" style={{height: "40px"}}
                    onClick={(event) => handleClose(event)}/>
            </div>
            <div className="analyzescreencenter">
                <h2 className="analyzescreensubtitle">Staged Files &#128194;</h2>
                <div className="updatescreenlist">
                    <StagedFileList/>
                </div>
                <div className="permissionadders">
                        <PermissionAdder addType="PUSH_ADD_WRITER" removeType="PULL_ADD_WRITER" role="Add Writers"/>
                        <PermissionAdder addType="PUSH_REMOVE_WRITES" removeType="PULL_REMOVE_WRITER" role="Remove Writers"/>
                        <PermissionAdder addType="PUSH_ADD_READER" removeType="PULL_ADD_READER" role="Add Readers"/>
                        <PermissionAdder addType="PUSH_REMOVE_READER" removeType="PULL_REMOVE_READER" role="Remove Readers"/>
                        <PermissionAdder addType="PUSH_ADD_COMMENTER" removeType="PULL_ADD_COMMENTER" role="Add Commenters"/>
                        <PermissionAdder addType="PUSH_REMOVE_COMMENTER" removeType="PULL_REMOVE_COMMENTER" role="Remove Commentors"/>
                        <PermissionAdder addType="PUSH_UNSHARE" removeType="PULL_UNSHARE" role="Unshare"/>
                </div>
            </div>
        </div>
    );
}