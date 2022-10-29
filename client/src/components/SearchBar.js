import React, {useState} from "react";
import {useDispatch} from 'react-redux';
import {getFilteredSnapshotFromBackend} from '../actions';
import {Form} from 'react-bootstrap';

export default function SearchBar() {
    // Stores current text within SearchBar
    const [text, setText] = useState('');
    const dispatch = useDispatch();

    // Send (id, query) to backend; update global state with filtered snapshot
    function handleSubmit(event) {
        if(event.key === 'Enter') {
            event.preventDefault();
            dispatch(getFilteredSnapshotFromBackend('Minato', text));
        }
    }

    let style = {
        margin: 'auto',
        marginTop: '2%',
        marginBottom: '2%',
        marginLeft: '15%',
        width: '70%'
    }

    return (
        <Form>
            <Form.Group style={style} controlId="formSearchBar">
                <Form.Label>Search</Form.Label>
                <Form.Control placeholder="Search for files..." 
                    onChange={(event) => setText(event.target.value)} onKeyPress={(event) => handleSubmit(event)}/>
            </Form.Group>
        </Form>
    );
}