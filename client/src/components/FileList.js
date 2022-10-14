import React from "react";
import FileCard from './FileCard';

export default function HomeScreen() {
    let testSnapshot = {
        id: '1',
        parent: null,
        date_created: '2022-10-14T16:12:34.563Z',
        date_modified: '2022-10-14T16:12:34.563Z',
        name: 'Root',
        children: [
            {
                id: '2',
                parent: '1',
                date_created: '2022-10-14T16:12:34.563Z',
                date_modified: '2022-10-14T16:12:34.563Z',
                name: 'child1',
                children: [
                {
                    id: '4',
                    parent: '2',
                    date_created: '2022-10-14T16:12:34.563Z',
                    date_modified: '2022-10-14T16:12:34.563Z',
                    name: 'grandchild1',
                    children: []
                },
                {
                    id: '5',
                    parent: '2',
                    date_created: '2022-10-14T16:12:34.563Z',
                    date_modified: '2022-10-14T16:12:34.563Z',
                    name: 'grandchild2',
                    children: []
                }]
            },
            {
                id: '3',
                parent: '1',
                date_created: '2022-10-14T16:12:34.563Z',
                date_modified: '2022-10-14T16:12:34.563Z',
                name: 'child2',
                children: [
                    {
                        id: '6',
                        parent: '3',
                        date_created: '2022-10-14T16:12:34.563Z',
                        date_modified: '2022-10-14T16:12:34.563Z',
                        name: 'grandchild3',
                        children: []
                    },
                    {
                        id: '7',
                        parent: '3',
                        date_created: '2022-10-14T16:12:34.563Z',
                        date_modified: '2022-10-14T16:12:34.563Z',
                        name: 'grandchild4',
                        children: []
                    }
                ]
            }
        ]
    }
    let key = 0;
    let directory = [];
    buildTree(testSnapshot);

    // DFS: returns directory structure (each file/folder is a FileCard)
    function buildTree(snapshot) {
        directory.push(<FileCard file={snapshot} depth={0} key={key++}/>)
        //directory.push("Name: " + snapshot.name + ", Depth: " + 0);
        buildTreeHelper(snapshot, 1)
    }

    // DFS: depth used for indentation
    function buildTreeHelper(root, depth) {
        for(let i = 0; i < root.children.length; i++) {
            directory.push(<FileCard file={root.children[i]} depth={depth} key={key++}/>)
            //directory.push("Name: " + root.children[i].name + ", Depth: " + depth);
            buildTreeHelper(root.children[i], depth + 1);
        }
    }

    return (
        <div>
            {directory} 
        </div>
    );
}
