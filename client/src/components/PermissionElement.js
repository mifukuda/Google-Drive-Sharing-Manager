import React, {useState, useEffect} from "react";
import {useSelector} from 'react-redux';
import {getGroupMembers} from '../api/group.js';

export default function PermissionElement(props) {
    const errorMessage = (<p className="groupmemberelement">You have not uploaded a snapshot for this group yet!</p>);
    const {index, element} = props;
    const roles = ["Viewer", "Commenter", "Editor", "Owner"];
    const currentSnapshot = useSelector(state => state.currentSnapshot);
    const [group, setGroup] = useState();
    const [body, setBody] = useState(errorMessage);
    const [showBody, setShowBody] = useState(false);

    useEffect(() => {
        if(group === undefined) {
            setBody(errorMessage);
        }
        else {
            setBody(buildGroupList());
        }
    }, [group]);

    function handleDisplayGroup() {
        if(!showBody && group === undefined) {
            getGroupMembers({snapshot_id: currentSnapshot._id, group_email: element.granted_to.email}).then(response => {
                if(response.status === 200) {
                    console.log(response.data.members);
                    setGroup(response.data.members);
                }
            });
        }
        setShowBody(!showBody);    
    }

    function buildGroupList() {
        if (group === undefined) return;
        let memberList = [<p className="groupmemberelement" key={0}><b>Members:</b></p>]
        for(let i = 0; i < group.length; i++) {
            memberList.push(<p className="groupmemberelement" key={i + 1}>{i + 1} {group[i]}</p>);
        }
        return memberList;
    }

    let permissionElement = null;
    if(element.granted_to.type === 'group') {
        let groupLink = <a href="#" onClick={() => handleDisplayGroup()}>{element.granted_to.email + ", " + element.granted_to.display_name}</a>
        permissionElement = <p>{index + 1}. {roles[element.role]}: {(Object.keys(element.granted_to).length !== 0) ? groupLink : (element.driveId)} (id: {element._id})</p>
        if(showBody) {
            permissionElement = 
                <div>
                    {permissionElement}
                    {body}
                </div>
        }
    }
    else {
        permissionElement = <p>{index + 1}. {roles[element.role]}: {(element.driveId !== 'anyoneWithLink') ? (element.granted_to.email + ", " + element.granted_to.display_name) : (element.driveId)} (id: {element._id})</p>
    }

    return (
        permissionElement
    );
}