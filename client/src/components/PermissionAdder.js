import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Form} from "react-bootstrap";
import UserListElement from './UserListElement.js';

export default function PermissionAdder(props) {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const {users, role, addType, removeType} = props;

    // Add or remove user email from list
    function handleSubmit(event) {
        if(event.key === 'Enter') {
            event.preventDefault();
            if(text === '') return;
            dispatch({type: addType, payload: text});
        }
    }
    
    return (
        <div className="permissionadder">
            <Form style={{width: "70%", marginBottom: "2%"}}>
                <Form.Group controlId="formSearchBar">
                    <Form.Label>
                        <b>{role}</b>
                    </Form.Label>
                    <Form.Control placeholder={role + ". Press 'ENTER' to add email."} 
                        value={text} onChange={(event) => setText(event.target.value)} onKeyPress={(event) => handleSubmit(event)}/>
                </Form.Group>
            </Form>
            <div>
                {(users.length === 0) ? "No emails added." : users.map((element, i) => <UserListElement key={i} name={element} removeType={removeType}/>)}
            </div>
        </div>
    );
}