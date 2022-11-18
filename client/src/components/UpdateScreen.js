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
                        <PermissionAdder role="Add Writers"/>
                        <PermissionAdder role="Remove Writers"/>
                        <PermissionAdder role="Add Readers"/>
                        <PermissionAdder role="Remove Readers"/>
                </div>
            </div>
        </div>
    );
}