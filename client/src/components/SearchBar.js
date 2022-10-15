import React, {useState} from "react";
import {useDispatch} from 'react-redux';
import {getFilteredSnapshotFromBackend} from '../actions';
import {Form} from 'react-bootstrap';

export default function SearchBar() {
    const [text, setText] = useState('');
    const dispatch = useDispatch();

    function handleSubmit(event) {
        if(event.key === 'Enter') {
            event.preventDefault();
            dispatch(getFilteredSnapshotFromBackend('Minato', text));
        }
    }

    let style = {
        margin: 'auto',
        marginBottom: '2%',
        width: '60%'
    }
    return (
        <Form>
            <Form.Group style={style} controlId="formBasicEmail">
                <Form.Label>Search</Form.Label>
                <Form.Control placeholder="Search for files..." 
                    onChange={event => setText(event.target.value)} onKeyPress={event => handleSubmit(event)}/>
            </Form.Group>
        </Form>
    );
}