import React, {useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Dropdown} from 'react-bootstrap';

export default function SnapshotSelector() {
    const dispatch = useDispatch();
    const allSnapshotInfo = useSelector(state => state.allSnapshotInfo);
    const currentSnapshot = useSelector(state => state.currentSnapshot);

    function handleUpdateDisplay(snapshot) {
        console.log("HELLO");
    }

    let snapshots = allSnapshotInfo.map((x, i) => <Dropdown.Item key={i} onClick={() => handleUpdateDisplay(x)}>{x._id} {x.createdAt}</Dropdown.Item>)

    return (
        <Dropdown>
            <Dropdown.Toggle style={{width: '82%', marginBottom:"5%"}} variant="info" id="sortdropdown">
                {currentSnapshot.id}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{width: '82%'}}>
                {snapshots}
            </Dropdown.Menu>
        </Dropdown>
    );
}