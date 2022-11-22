import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DeviantSharingList from "./DeviantSharingList";
import SharingDifferencesList from "./SharingDifferencesList";
import {getDeviantSharingResultsFromBackend, getSharingDifferencesResultsFromBackend, clearAnalyzeScreen} from '../actions';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-bootstrap';

export default function AnalyzeScreen() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const [threshold, setThreshold] = useState(80);
    const currentSnapshot = useSelector(state => state.currentSnapshot);

    //Stage files
    useEffect(() => {
        dispatch(getDeviantSharingResultsFromBackend(".8", currentSnapshot._id));
        dispatch(getSharingDifferencesResultsFromBackend(currentSnapshot._id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Navigate to home page when close button is
    function handleClose(event) {
        dispatch(clearAnalyzeScreen());
        navigate("/home", {state:{from:'analyze'}});
    }

    function handleThresholdChange(event) {
        setThreshold(event.target.value);
    }

    // Perform deviant sharing with new threshold
    function handleSubmitThreshold() {
        let thresholdPercent = "" + (threshold / 100);
        console.log(thresholdPercent);
        dispatch(getDeviantSharingResultsFromBackend(thresholdPercent, currentSnapshot._id));
    }

    return (
        <div className="analyzescreen">
            <div className="analyzescreenheader">
                <h1 className="analyzescreenheadertitle">Analysis Results &#128221;</h1>
                <div className="analyzescreenheaderbutton">
                    <input className="exitbutton" type="image" src={require('../images/closebutton.png')} alt="close button" style={{height: "40px"}}
                        onClick={(event) => handleClose(event)}/>
                </div>
            </div>
            <div className="analyzescreencenter">
                <h2 className="analyzescreensubtitle">Deviant Sharing &#128520;</h2>
                <div className="thresholdsetter">
                    <span><b>Set new threshold (%):</b></span>
                    <input type="number" name="threshold" min="0" max="100" defaultValue="80" onChange={(event) => handleThresholdChange(event)}/>
                    <button className="thresholdbutton" onClick={() => handleSubmitThreshold()}>Submit</button>
                </div>
                <DeviantSharingList/>
                <h2 className="analyzescreensubtitle">Sharing Differences &#128373;</h2>
                <SharingDifferencesList/>
            </div>
        </div>
    );
}