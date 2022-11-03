import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sortByName, sortByDateOld, sortByDateNew} from "../actions";
import {Dropdown} from "react-bootstrap";

// Button redirects to Google Auth
export default function FileListHeader() {
    const dispatch = useDispatch();
    const numSelected = useSelector(state => state.selected);
    const queryString = useSelector(state => state.filter);
    const [sortField, setSortField] = useState(null);

    function handleSortByName() {
        setSortField("NAME");
        dispatch(sortByName());
    }

    function handleSortByDateOld() {
        setSortField("DATEOLD");
        dispatch(sortByDateOld());
    }

    function handleSortByDateNew() {
        setSortField("DATENEW");
        dispatch(sortByDateNew());
    }

    let sortDropdown = "";
    if(queryString) {
        sortDropdown = 
        <Dropdown>
            <Dropdown.Toggle style={{width: '100%'}} variant="secondary" id="sortdropdown">
                Sort
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item active={sortField === "NAME"} onClick={() => handleSortByName()}>Name (A-Z)</Dropdown.Item>
                <Dropdown.Item active={sortField === "DATEOLD"} onClick={() => handleSortByDateOld()}>Newest (Modified)</Dropdown.Item>
                <Dropdown.Item active={sortField === "DATENEW"} onClick={() => handleSortByDateNew()}>Oldest (Date Modified)</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    }
    return (
        <div className="filelistheader">
            <p style={{marginBottom: "0", marginRight:"75%"}}>Snapshot: {numSelected.length} Selected</p>
            {sortDropdown}
        </div>
    );
}