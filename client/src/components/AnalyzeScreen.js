import React from "react";
import {useNavigate } from "react-router-dom";
import DeviantSharingList from "./DeviantSharingList";
import SharingDifferencesList from "./SharingDifferencesList";

export default function AnalyzeScreen() {
    let navigate = useNavigate();

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