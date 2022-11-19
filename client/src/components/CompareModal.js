import React, {useState} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {hideCompareModal} from '../actions';
import {Modal, Button, Dropdown} from 'react-bootstrap';

// Button redirects to Google Auth
export default function CompareModal() {
    const dispatch = useDispatch();
    const showCompareModal = useSelector(state => state.showCompareModal);
    const allSnapshotInfo = useSelector(state => state.allSnapshotInfo);
    const [snapshot1, setSnapshot1] = useState(() => {
        return ((allSnapshotInfo[0] === undefined) ? null : allSnapshotInfo[0])
    });
    const [snapshot2, setSnapshot2] = useState(() => {
        return ((allSnapshotInfo[1] === undefined) ? null : allSnapshotInfo[1])
    });

    function handleCloseCompareModal() {
        dispatch(hideCompareModal());
    }

    function handleUpdateSelection1(snapshot) {
        setSnapshot1(snapshot);
    }

    function handleUpdateSelection2(snapshot) {
        setSnapshot2(snapshot);
    }

    let snapshots1 = allSnapshotInfo.map((x, i) => <Dropdown.Item key={i} active={snapshot1._id === x._id} onClick={() => handleUpdateSelection1(x)}>{new Date(x.createdAt).toLocaleString("en-US", {timeZone: "America/New_York"})}</Dropdown.Item>)
    let snapshots2 = allSnapshotInfo.map((x, i) => <Dropdown.Item key={i} active={snapshot2._id === x._id} onClick={() => handleUpdateSelection2(x)}>{new Date(x.createdAt).toLocaleString("en-US", {timeZone: "America/New_York"})}</Dropdown.Item>)

    let body = <p>You only have {allSnapshotInfo.length} snapshot(s). Create more snapshots to use this feature.</p>
    if (allSnapshotInfo.length >= 2) {
        body =
            <div className="comparemodalbody">
                <p className="comparemodalsubtitle">Snapshot 1:</p>
                <Dropdown>
                    <Dropdown.Toggle style={{width: '60%', marginBottom:'3%'}} variant="primary" id="dropdown-basic">
                        {new Date(snapshot1.createdAt).toLocaleString("en-US", {timeZone: "America/New_York"})}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {snapshots1}
                    </Dropdown.Menu>
                </Dropdown>
                <p className="comparemodalsubtitle">Snapshot 2:</p>
                <Dropdown>
                    <Dropdown.Toggle style={{width: '60%', marginBottom:'3%'}} variant="primary" id="dropdown-basic">
                        {new Date(snapshot2.createdAt).toLocaleString("en-US", {timeZone: "America/New_York"})}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {snapshots2}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
    }

    return (
        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={showCompareModal}>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1>Compare Snapshots &#128248;</h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={(allSnapshotInfo.length < 2)}>Compare</Button>
                <Button variant="secondary" onClick={() => handleCloseCompareModal()}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
}