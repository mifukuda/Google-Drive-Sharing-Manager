import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {getFilteredSnapshotFromBackend, setFilter, showModal} from '../actions';
import {Form, Button} from 'react-bootstrap';

export default function SearchBar(props) {
    const currentSnapshot = useSelector(state => state.currentSnapshot);
    // Stores current text within SearchBar
    const [text, setText] = useState(props.filter);
    useEffect(() => {
        setText(props.filter);
    }, [props.filter])
    const dispatch = useDispatch();

    // Send (id, query) to backend; update global state with filtered snapshot
    function handleSubmit(event) {
        if(event.key === 'Enter') {
            event.preventDefault();
            if(text === '') {
                dispatch(setFilter(''));
            }
            else{
                dispatch(getFilteredSnapshotFromBackend(currentSnapshot._id, text));
            }
        }
    }

    // Make query builder visible
    function handleShowModal(event) {
        dispatch(showModal());
    }

    let style = {
        marginRight: '1%',
        width: '59%'
    }

    return (
        <div className="querycontrols">
            <Form style={style}>
                <Form.Group controlId="formSearchBar">
                    <Form.Label>
                        Search
                    </Form.Label>
                    <Form.Control placeholder="Search for files..." 
                        value={text} onChange={(event) => setText(event.target.value)} onKeyPress={(event) => handleSubmit(event)}/>
                </Form.Group>
            </Form>
            <Button variant="dark" style={{marginTop: "2.4%", bottom: 0, width: '10%', height: '10%'}} onClick={(event) => handleShowModal(event)}>Build Query</Button>
        </div>
    );
}