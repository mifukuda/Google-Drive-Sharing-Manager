import React from "react";

// Button redirects to Google Auth
export default function WelcomeScreen() {
    return (
        <div className="welcomescreen">
            <h1 style={{marginBottom: '1%'}}>Welcome to The Microservice's</h1>
            <h1 style={{marginBottom: '2%'}}>Drive Sharing Manager</h1>
            <a className="btn btn-outline-dark" role="button" style={{margin: 'auto', height: '45px', width: '250px', marginBottom:'1%'}} href="http://localhost:4000/auth/login">
                <img src={require('../images/googlelogo.png')} style={{height: '70%', marginRight: '10px', }} alt="Google Logo"/>
                Log In With Google
            </a>
            <p style={{margin: '0'}}>-or-</p>
            <a className="btn btn-outline-dark" role="button" style={{margin: 'auto', height: '45px', width: '250px', marginTop:'1%'}} href="http://localhost:4000/auth/mslogin">
                <img src={require('../images/onedrivelogo.png')} style={{height: '70%', marginRight: '10px', }} alt="Google Logo"/>
                Log In With OneDrive
            </a>
        </div>
    );
}