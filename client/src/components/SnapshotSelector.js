import React, {useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Dropdown} from 'react-bootstrap';

export default function SnapshotSelector() {
    const dispatch = useDispatch();
    const allSnapshotInfo = useSelector(state => state.allSnapshotInfo);
    const currentSnapshot = useSelector(state => state.currentSnapshot);

    return (
        <Dropdown>
            <Dropdown.Toggle style={{width: '82%', marginBottom:"5%"}} variant="info" id="sortdropdown">
                {currentSnapshot.id}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item active>Name (A-Z)</Dropdown.Item>
                <Dropdown.Item active>Newest (Modified)</Dropdown.Item>
                <Dropdown.Item active>Oldest (Date Modified)</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}