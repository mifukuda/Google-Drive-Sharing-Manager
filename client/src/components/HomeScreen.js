import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getSnapshotFromBackend} from "../actions";
import FileList from "./FileList";
import SearchBar from "./SearchBar";

export default function FileCard() {
    const dispatch = useDispatch();
    //Return default snapshot (most recent) from backend
    useEffect(() => {
        dispatch(getSnapshotFromBackend());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="home-screen">
            <SearchBar/>
            <div className="filelist">
                <p>Snapshot:</p>
                <FileList/>
            </div>
        </div>
    );
}