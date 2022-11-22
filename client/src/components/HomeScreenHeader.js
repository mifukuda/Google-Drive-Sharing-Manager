import React from "react";
import {useDispatch} from 'react-redux';
import {Popover, OverlayTrigger} from 'react-bootstrap';

// Button redirects to Google Auth
export default function HomeScreenHeader() {
    const dispatch = useDispatch();

    function handleLogOut() {
        dispatch({type:'LOG_OUT'});
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <a href="#" onClick={() => handleLogOut()}>Log Out</a>
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="homescreenheader">
            <div className="homescreentitle">
                <h1>Home &#127969;</h1>
            </div>
            <div className="logoutbutton">
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                    <input className="exitbutton" type="image" src={require('../images/accountbutton.png')} alt="close button" style={{height: "50px"}}/>
                </OverlayTrigger>
            </div>
        </div>
    );
}
