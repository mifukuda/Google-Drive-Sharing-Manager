import React, {useEffect} from "react";
import {useNavigate } from "react-router-dom";
import DeviantSharingList from "./DeviantSharingList";
import SharingDifferencesList from "./SharingDifferencesList";
import {performDeviantSharing} from '../api';

export default function AnalyzeScreen() {
    let navigate = useNavigate();

    //Stage files
    useEffect(() => {
        performDeviantSharing().then((response) => {
            console.log(response);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Navigate to home page when close button is
    function handleClose(event) {
        navigate("/home");
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
                <DeviantSharingList/>
                <h2 className="analyzescreensubtitle">Sharing Differences &#128373;</h2>
                <SharingDifferencesList/>
            </div>
        </div>
    );
}