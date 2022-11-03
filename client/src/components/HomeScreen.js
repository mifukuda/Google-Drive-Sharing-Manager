import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getSnapshotFromBackend} from "../actions";
import FileList from "./FileList";
import FileListHeader from "./FileListHeader";
import HomeScreenHeader from "./HomeScreenHeader";
import QueryBuilder from "./QueryBuilder";
import SearchBar from "./SearchBar";
import SideBar from "./SideBar";

export default function FileCard() {
    const dispatch = useDispatch();
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
                    <FileListHeader/>
                    <FileList updating={false}/>
                </div>
            </div>
        </div>
    );
}