import React from "react";
import { Link } from "react-router-dom";

// Put links for take snapshot, compare snapshot, manage policy requirements
export default function SideBar() {
    return (
        <div className="sidebar">
            <div className="sidebar1">
                <h2 className="sidebarlogo">The</h2>
                <h1 className="sidebarlogo">Microservices</h1>
                <h2 className="sidebarlogo">Drive Sharing Manager</h2>
                <button className="sidebarbutton">+ New Snapshot</button>
                <ul>
                    <li>
                        <Link to="/analyze" className="sidebarlink">Analyze Sharing</Link>
                    </li>
                    <li>
                        <Link to="/update" className="sidebarlink">Update Permissions</Link>
                    </li>
                </ul>
            </div>
            <div className="sidebar2">
                <h2>Selection:</h2>
            </div>
        </div>
    );
}