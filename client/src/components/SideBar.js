import React from "react";
import { Link } from "react-router-dom";

// Put links for take snapshot, compare snapshot, manage policy requirements
export default function SideBar() {
    return (
        <div className="sidebar">
           <h2 className="sidebarlogo">The</h2>
           <h1 className="sidebarlogo">Microservices</h1>
           <button className="sidebarButton">Take Snapshot</button>
           <ul>
                <li>
                    <Link to="/analyze" className="sidebarlink">Analyze Sharing</Link>
                </li>
            </ul>
        </div>
    );
}