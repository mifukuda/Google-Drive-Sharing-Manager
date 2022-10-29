import React from "react";
import { Link } from "react-router-dom";

// Put links for take snapshot, compare snapshot, manage policy requirements
export default function SideBar() {
    return (
        <div className="sidebar">
           <h2 className="sidebarlogo">The</h2>
           <h1 className="sidebarlogo">Microservices</h1>
           <ul>
                <li>
                    <Link to="/analyze">Analyze Sharing</Link>
                </li>
            </ul>
        </div>
    );
}