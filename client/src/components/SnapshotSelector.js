import React, {useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Dropdown} from 'react-bootstrap';
import {getSnapshotFromBackend} from "../actions";

export default function SnapshotSelector() {
    const dispatch = useDispatch();
    const allSnapshotInfo = useSelector(state => state.allSnapshotInfo).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const currentSnapshot = useSelector(state => state.currentSnapshot);

    function handleUpdateDisplay(snapshot) {
        dispatch(getSnapshotFromBackend(snapshot._id));
    }

    let snapshots = allSnapshotInfo.map((x, i) => <Dropdown.Item key={i} active={currentSnapshot._id === x._id}onClick={() => handleUpdateDisplay(x)}>{new Date(x.createdAt).toLocaleString("en-US", {timeZone: "America/New_York"})}</Dropdown.Item>)

    return (
        <Dropdown>
            <Dropdown.Toggle style={{width: '82%', marginBottom:"5%"}} variant="info" id="sortdropdown">
                {new Date(currentSnapshot.date_created).toLocaleString("en-US", {timeZone: "America/New_York"})}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{width: '82%'}}>
                {snapshots}
            </Dropdown.Menu>
        </Dropdown>
    );
}