import React, {useState} from "react";
import {useSelector} from 'react-redux';
import DeviantSharingCard from "./DeviantSharingCard";

export default function DeviantSharingList() {
    const data = useSelector(state => state.deviantSharingResults);
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];
    
    let key = 0;
    let cards = []
    if('instances' in data) {
        buildList(data.instances);
    }

    function buildList(results) {
        for(let i=0; i < results.length; i++) {
            buildListHelper(results[i]);
        }
    }

    function buildListHelper(result) {
        let majorityPermissions = result.majorityPermission.map((element, i) =>  <p key={i+1}>{i + 1}. {element.granted_to.email}, {element.granted_to.display_name} ({roles[element.role]})</p>)
        majorityPermissions.unshift(<p key={0}><b>Majority Permissions</b></p>);
        cards = cards.concat(result.deviantlyShared.map((element, i) => <DeviantSharingCard key={key++} majorityPermissions={majorityPermissions} deviantFile={element}/>))
    }

    return (
        <div className="deviantsharinglist">
            {cards}
        </div>
    );
}