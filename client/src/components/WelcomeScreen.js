import React from "react";

// Button redirects to Google Auth
export default function WelcomeScreen() {
    return (
        <div className="welcomescreen">
            <p>Welcome to The Microservice's</p>
            <p>Drive Sharing Manager</p>
            <a className="btn btn-outline-dark" role="button" style={{margin: 'auto', height: '45px'}} href="http://localhost:4000/auth/login">
                <img src={require('../images/googlelogo.png')} style={{height: '70%', marginRight: '10px', }} alt="Google Logo"/>
                Log In With Google
            </a>
        </div>
    );
}