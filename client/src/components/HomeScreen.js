import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSnapshotFromBackend} from "../actions";
import FileList from "./FileList";
import FileListHeader from "./FileListHeader";
import HomeScreenHeader from "./HomeScreenHeader";
import QueryBuilder from "./QueryBuilder";
import SearchBar from "./SearchBar";
import SideBar from "./SideBar";

export default function FileCard() {
    const dispatch = useDispatch();
    const snapshot = useSelector(state => state.currentSnapshot);
    const filter = useSelector(state => state.filter);
    //Return default snapshot (most recent) from backend
    useEffect(() => {
        console.log("Fetching from backend.");
        if(Object.keys(snapshot).length === 0) {
            dispatch(getSnapshotFromBackend());
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }
        else {
            console.log("Aborting fetch.")
        }
    }, []);
    return (
        <div className="homescreen">
            <QueryBuilder/>
            <SideBar/>
            <div className="homescreencenter">
                <HomeScreenHeader/>
                <SearchBar filter={filter}/>
                <div className="filelist">
                    <FileListHeader/>
                    <FileList updating={false}/>
                </div>
            </div>
        </div>
    );
}