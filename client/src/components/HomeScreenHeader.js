import React from "react";

// Button redirects to Google Auth
export default function HomeScreenHeader() {
    return (
        <div className="homescreenheader">
            <div className="homescreentitle">
                <h1>Home &#127969;</h1>
            </div>
            <div>
                <input className="exitbutton" type="image" src={require('../images/accountbutton.png')} alt="close button" style={{height: "50px"}}/>
            </div>
        </div>
    );
}
