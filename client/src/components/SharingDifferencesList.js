import React from "react";
import {useSelector} from 'react-redux';
import SharingDifferencesCard from "./SharingDifferencesCard";

export default function SharingDifferencesList() {
    const data = useSelector(state => state.sharingDifferencesResults);

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
        cards = cards.concat(result.children.map((element, i) => <SharingDifferencesCard key={key++} parent={result.parent} child={element}/>))
    }

    return (
        <div className="sharingdifferenceslistcontainer">
            <div className="sharingdifferenceslist">
                {cards}
            </div>
        </div>
    );
}