import React from "react";
import {useNavigate } from "react-router-dom";

export default function UpdateScreen() {
    let navigate = useNavigate();

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
                
            </div>
        </div>
    );
}