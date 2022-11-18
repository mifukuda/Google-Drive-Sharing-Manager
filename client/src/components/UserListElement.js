import React from "react";
import {CloseButton} from 'react-bootstrap';
import {useDispatch} from 'react-redux';

export default function UserListElement(props) {
    const dispatch = useDispatch();
    const {name, removeType} = props;

    function handleRemove() {
        dispatch({type: removeType, payload: name})
    }

    return (
        <span className="userlistelement">
            {name}
            <CloseButton onClick={() => handleRemove()} style={{paddingLeft:"5px", height:"0.5em"}}/>
        </span>
    );
}