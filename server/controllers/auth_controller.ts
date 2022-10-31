const google = require('googleapis').google 
import { Request, Response } from 'express';
const CONFIG = require('../configs.js')
import jwt from 'jsonwebtoken'

// Create an OAuth2 client object for google
const OAuth2 = google.auth.OAuth2
const auth_client = new OAuth2(
    CONFIG.oauth_credentials.client_id, 
    CONFIG.oauth_credentials.client_secret, 
    CONFIG.oauth_credentials.redirect_uris[0]
);

const login = (req: Request, res: Response) => {
    // Obtain the google login link 
    const auth_url = auth_client.generateAuthUrl({
        access_type: 'offline', // Does not require user to constantly give consent
        scope: CONFIG.oauth_credentials.scopes 
    });
    return res.redirect(auth_url);
}

const auth_callback = (req: Request, res: Response) => {
    if(req.query.error){
        console.log("Error recieving Authorization Code")
        return res.redirect('/')
    }
    auth_client.getToken(req.query.code, function(err: any, token: any) {
        if(err) {
            console.log("Failed to get token.")
            return res.redirect('/')
        }
        res.cookie('jwt', jwt.sign(token, CONFIG.JWT_secret));
        return res.redirect('http://localhost:3000/home');
    })
}

export { login, auth_callback, auth_client }