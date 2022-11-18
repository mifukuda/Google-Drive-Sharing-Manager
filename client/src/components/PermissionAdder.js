import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Form} from "react-bootstrap";
import UserListElement from './UserListElement.js';

export default function PermissionAdder(props) {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const {users, role, addType, removeType} = props;

    function handleSubmit(event) {
        if(event.key === 'Enter') {
            event.preventDefault();
            dispatch({type: addType, payload: text});
        }
    }

    //let example = ["minato.fukuda@stonybrook.edu", "mifukuda@cs.stonybrook.edu", "minatofukuda@gmail.com", "minatofukuda2@gmail.com", "minatofukuda@yahoo.com"]
    
    return (
        <div className="permissionadder">
            <Form style={{marginBottom: "2%"}}>
                <Form.Group controlId="formSearchBar">
                    <Form.Label>
                        <b>{role}</b>
                    </Form.Label>
                    <Form.Control placeholder={role} 
                        value={text} onChange={(event) => setText(event.target.value)} onKeyPress={(event) => handleSubmit(event)}/>
                </Form.Group>
            </Form>
            <div>
                {(users.length === 0) ? "No emails added." : users.map((element, i) => <UserListElement key={i} name={element} removeType={removeType}/>)}
            </div>
        </div>
    );
}