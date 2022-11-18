import React from "react";
import {CloseButton} from 'react-bootstrap';

export default function UserListElement(props) {
    const {name} = props;
    return (
        <span className="userlistelement">
            {name}
            <CloseButton style={{paddingLeft:"5px", height:"0.5em"}}/>
        </span>
    );
}