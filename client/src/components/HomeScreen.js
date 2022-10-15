import React from "react";
import FileList from "./FileList";
import SearchBar from "./SearchBar";

export default function FileCard() {
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