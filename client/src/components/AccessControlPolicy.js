import { useEffect, useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

export default function AccessControlPolicy({ access_control_policy }) {
    const dispatch = useDispatch()

    const [editMode, setEditMode] = useState(false)


    return (
        <Accordion>
        {console.log(access_control_policy)}
            <Accordion.Item>
                <Accordion.Header>
                    <Button>{editMode ? "Save" : "Edit"}</Button>
                </Accordion.Header>
            </Accordion.Item>
        </Accordion>
    )
}