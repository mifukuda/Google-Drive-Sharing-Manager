import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSnapshotFromBackend} from "../actions";
import FileList from "./FileList";
import HomeScreenHeader from "./HomeScreenHeader";
import QueryBuilder from "./QueryBuilder";
import SearchBar from "./SearchBar";
import SideBar from "./SideBar";

export default function FileCard() {
    const dispatch = useDispatch();
    const numSelected = useSelector(state => state.selected);
    //Return default snapshot (most recent) from backend
    useEffect(() => {
        dispatch(getSnapshotFromBackend());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="homescreen">
            <QueryBuilder/>
            <SideBar/>
            <div className="homescreencenter">
                <HomeScreenHeader/>
                <SearchBar/>
                <div className="filelist">
                    <p>Snapshot: {numSelected.length} Selected</p>
                    <FileList updating={false}/>
                </div>
            </div>
        </div>
    );
}