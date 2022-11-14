const google = require('googleapis').google 
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { GoogleDriveAdapter } from "../classes/DriveAdapter"
import { UserProfile } from "../classes/UserClasses"
const CONFIG = require('../configs.js')

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
    })
    return res.redirect(auth_url)
}

const auth_callback = async (req: Request, res: Response) => {
    //If the person does not provide authorization, an error will be returnedß
    if(req.query.error){
        console.log("Error recieving Authorization Code")
        return res.redirect('/')
    }

    //getting tokens for OAuth
    let tokens
    try{
        tokens = (await auth_client.getToken(req.query.code)).tokens
    }catch (err){
        console.log("Error getting tokens.", err)
    }

    //get the id of the user
    let ticket 
    try{
        ticket = await auth_client.verifyIdToken({
            idToken: tokens.id_token,
            audience: CONFIG.oauth_credentials.client_id
        })
    }catch(err){
        console.log("Error getting tokens.", err)
    }
    const payload = ticket.getPayload()
    
    //make an object for drive adapter
    const drive = new GoogleDriveAdapter(tokens.refresh_token)

    //check the database to see if the user already exists
    let userProfile = await UserProfile.getUserProfileByDriveId(payload.sub)
    if(!userProfile){
        userProfile = await UserProfile.createUserProfile(
            payload.sub,
            drive.driveToken,
            "GOOGLE",
            payload.name,
            payload.email
        )
    }

    return res.cookie("jwt", jwt.sign({
        _id: (userProfile._id as Types.ObjectId).toString()
    }, CONFIG.JWT_secret), {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }).status(200).redirect("http://localhost:3000/home")
}

export { login, auth_callback, auth_client }