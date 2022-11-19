import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getSnapshotFromBackend, getAllSnapshotInfoFromBackend} from "../actions";
import CompareModal from './CompareModal';
import FileList from "./FileList";
import FileListHeader from "./FileListHeader";
import HomeScreenHeader from "./HomeScreenHeader";
import QueryBuilder from "./QueryBuilder";
import SearchBar from "./SearchBar";
import SideBar from "./SideBar";

export default function HomeScreen() {
    const dispatch = useDispatch();
    const allSnapshotInfo = useSelector(state => state.allSnapshotInfo);
    const snapshot = useSelector(state => state.currentSnapshot);
    const filter = useSelector(state => state.filter);

    //Return default snapshot (most recent) from backend
    useEffect(() => {
        if(allSnapshotInfo.length === 0) {
            console.log("Fetching all snapshot info from backend.");
            dispatch(getAllSnapshotInfoFromBackend());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="homescreen">
            <QueryBuilder/>
            <CompareModal/>
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