import React from "react";
import {useSelector} from "react-redux";
import FileCard from './FileCard';

export default function StagedFileList(props) {
    const stagedFiles = useSelector(state => state.stagedFiles);
    function buildList(snapshot) {
        for(let i = 0; i < snapshot.length; i++) {
            directory.push(<FileCard staged={true} file={snapshot[i]} depth={0} key={key++} isRoot={false}/>);
        }
    }

    let key = 0;
    let directory = [];
    buildList(stagedFiles);

    return (
        <div>
            {directory} 
        </div>
    );
}