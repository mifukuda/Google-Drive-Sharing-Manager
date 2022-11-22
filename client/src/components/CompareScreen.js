import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'react-bootstrap';
import CompareSnapshotCard from './CompareSnapshotCard';

export default function AnalyzeScreen() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector(state => state.compareSnapshotResults);

    // Navigate to home page when close button is
    function handleClose(event) {
        dispatch({type: 'CLEAR_COMPARE_SCREEN'});
        navigate("/home");
    }

    function buildList(results) {
        for(let i = 0; i < results.instances.length; i++) {
            let instance = results.instances[i];
            cards.push(<CompareSnapshotCard file={instance.file} oldPermissions={instance.oldPermissions} newPermissions={instance.newPermissions}/>)
        }
    }

    let cards = []
    if('instances' in data) {
        buildList(data);
    }

    return (
        <div className="analyzescreen">
            <div className="analyzescreenheader">
                <h1 className="analyzescreenheadertitle">Compare Snapshots &#128248;</h1>
                <div className="analyzescreenheaderbutton">
                    <input className="exitbutton" type="image" src={require('../images/closebutton.png')} alt="close button" style={{height: "40px"}}
                        onClick={(event) => handleClose(event)}/>
                </div>
            </div>
            <div className="analyzescreencenter">
                <h2 className="analyzescreensubtitle">Comparison Results &#128248;</h2>
                <div className="comparesnapshotlist">
                    {cards.length}
                </div>
            </div>
        </div>
    );
}