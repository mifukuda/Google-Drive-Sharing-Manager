import React from "react";
import {useSelector} from "react-redux";
import FileCard from './FileCard';

export default function HomeScreen(props) {
    const snapshot = useSelector(state => state.currentSnapshot);
    const searchResults = useSelector(state => state.searchResults);
    const filter = useSelector(state => state.filter);
    //const selectedFiles = useSelector(state => state.selectedFiles);
    const {updating} = props;

    // Building list from search results
    function buildList(snapshot) {
        for(let i = 0; i < snapshot.length; i++) {
            directory.push(<FileCard staged={false} file={snapshot[i]} depth={0} key={key++} isRoot={false}/>);
        }
    }

    // DFS: returns directory structure (each file/folder is a FileCard)
    function buildTree(snapshot) {
        directory.push(<FileCard staged={false} file={snapshot} depth={0} key={key++} isRoot={true}/>);
        //directory.push("Name: " + snapshot.name + ", Depth: " + 0);
        buildTreeHelper(snapshot, 1)
    }

    // DFS: depth used for indentation
    function buildTreeHelper(root, depth) {
        if (root.children) {
            for(let i = 0; i < root.children.length; i++) {
                directory.push(<FileCard staged={false} file={root.children[i]} depth={depth} key={key++} isRoot={false}/>);
                //directory.push("Name: " + root.children[i].name + ", Depth: " + depth);
                buildTreeHelper(root.children[i], depth + 1);
            }
        }
    }

    let key = 0;
    let directory = [];
    /*if(updating) {
        buildList(selectedFiles);
    }*/
    if(snapshot) {
        try {
            // For search results
            if(filter) {
                buildList(searchResults.query_results);
            }
            // For entire snapshot
            else if (Object.keys(snapshot).length !== 0) {
                for(let i = 0; i < snapshot.drive_roots.length; i++) {
                    buildTree(snapshot.drive_roots[i]);
                }
            }
        } catch (error) {
            console.log(error);
            directory = [];
        }
    }

    return (
        <div className="filelistinner">
            {directory} 
        </div>
    );
}
