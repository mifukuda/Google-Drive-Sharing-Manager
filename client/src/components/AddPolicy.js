import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"

export default function AddPolicy({ setAddMode }) {
    const [formState, setFormState] = useState({name: "", query: "", AR: "", AW: "", DR: "", DW: ""})

    function handleFormChange(e) {
        const { name, value } = e.target
        setFormState(prev => ({...prev, [name]: value}))
    }

    return (
        <Container>
            {formState.AR}
            <Form.Group>
                <Form.Label>Policy Name:</Form.Label>
                <Form.Control
                    placeholder="Enter Query"
                    name="query"
                    value={formState.query}
                    onChange={handleFormChange}
                    type="text"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Query:</Form.Label>
                <Form.Control
                    placeholder="Enter Query"
                    name="query"
                    value={formState.query}
                    onChange={handleFormChange}
                    type="text"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Allowed Readers:</Form.Label>
                <Form.Control
                    placeholder="Enter comma delimited list of emails you want as allowed readers"
                    name="AR"
                    value={formState.AR}
                    onChange={handleFormChange}
                    type="text"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Allowed Writers:</Form.Label>
                <Form.Control
                    placeholder="Enter comma delimited list of emails you want as allowed writers"
                    name="AW"
                    value={formState.AW}
                    onChange={handleFormChange}
                    type="text"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Denied Readers:</Form.Label>
                <Form.Control
                    placeholder="Enter comma delimited list of emails you want as denied readers"
                    name="DR"
                    value={formState.DR}
                    onChange={handleFormChange}
                    type="text"
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Denied Writers:</Form.Label>
                <Form.Control
                    placeholder="Enter comma delimited list of emails you want as denied writers"
                    name="DW"
                    value={formState.DW}
                    onChange={handleFormChange}
                    type="text"
                />
            </Form.Group>
            <Button onClick={() => setAddMode(false)}>Discard</Button>
            <Button>Save</Button>
        </Container>
    )
}