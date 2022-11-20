import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DeviantSharingList from "./DeviantSharingList";
import SharingDifferencesList from "./SharingDifferencesList";
import {getDeviantSharingResultsFromBackend} from '../actions';
import {useDispatch} from 'react-redux';
import {Button} from 'react-bootstrap';

export default function AnalyzeScreen() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    //Stage files
    useEffect(() => {
        dispatch(getDeviantSharingResultsFromBackend(".8"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Navigate to home page when close button is
    function handleClose(event) {
        navigate("/home");
    }

    function handleThresholdChange(event) {
        let threshold = "" + (event.target.value / 100);
        console.log(threshold);
        dispatch(getDeviantSharingResultsFromBackend(threshold));
    }

    return (
        <div className="analyzescreen">
            <div className="analyzescreenheader">
                <h1 className="analyzescreenheadertitle">Analysis Results &#128221;</h1>
                <input className="exitbutton" type="image" src={require('../images/closebutton.png')} alt="close button" style={{height: "40px"}}
                    onClick={(event) => handleClose(event)}/>
            </div>
            <div className="analyzescreencenter">
                <h2 className="analyzescreensubtitle">Deviant Sharing &#128520;</h2>
                <div className="thresholdsetter">
                    <span><b>Set new threshold (%):</b></span>
                    <input type="number" name="threshold" min="0" max="100" defaultValue="80"/>
                    <button className="thresholdbutton" onClick={(event) => handleThresholdChange(event)}>Submit</button>
                </div>
                <DeviantSharingList/>
                <h2 className="analyzescreensubtitle">Sharing Differences &#128373;</h2>
                <SharingDifferencesList/>
            </div>
        </div>
    );
}