const google = require('googleapis').google 
import * as msal from '@azure/msal-node'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { UserProfile } from "../classes/UserClasses"
const CONFIG = require('../configs.js')

// Create an OAuth2 client object for google
const OAuth2 = google.auth.OAuth2
const auth_client = new OAuth2(
    CONFIG.oauth_credentials.client_id, 
    CONFIG.oauth_credentials.client_secret, 
    CONFIG.oauth_credentials.redirect_uris[0]
);

// Create a auth object for onedrive
const ms_auth_client = new msal.ConfidentialClientApplication({
    auth: {
        clientId: CONFIG.onedrive_credentials.client_id,
        authority: CONFIG.onedrive_credentials.cloud_instance 
            + CONFIG.onedrive_credentials.tenant_id, 
        clientSecret: CONFIG.onedrive_credentials.client_secret 
    },
    system: {
        
    }
})

const login = (req: Request, res: Response) => {
    // Obtain the google login link 
    const auth_url = auth_client.generateAuthUrl({
        access_type: 'offline', // Does not require user to constantly give consent
        prompt: 'consent',
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

    //check the database to see if the user already exists
    let userProfile = await UserProfile.getUserProfileByDriveId(payload.sub)
    console.log("userprofile: ", userProfile)
    if(!userProfile){
        userProfile = await UserProfile.createUserProfile(
            payload.sub,
            tokens.refreshToken,
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

const msLogin = async (req: Request, res: Response) => {
    const authCodeUrlParameters = {
        scopes: CONFIG.onedrive_credentials.scopes,
        redirectUri: CONFIG.onedrive_credentials.redirect_uris[0],
    }
    try{
        const redirectUri = await ms_auth_client.getAuthCodeUrl(authCodeUrlParameters)
        return res.redirect(redirectUri)
    }catch (e){
        console.log(e)
        return res.status(402).json({
            status: "FAILED"
        })
    }

    // res.redirect("https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" + 
    //     querystring.stringify({
    //         response_type: 'code',
    //         client_id: CONFIG.onedrive_credentials.client_id,
    //         scope: CONFIG.onedrive_credentials.scopes,
    //         redirect_uri: CONFIG.onedrive_credentials.redirect_uris[0],
    //     })
    // )

}

const msCallback = async(req: Request, res: Response) => {
    
    const tokenRequest:any = {
        code: req.query.code,
        scopes: CONFIG.onedrive_credentials.scopes,
        redirectUri: CONFIG.onedrive_credentials.redirect_uris[0],
    }

    //use the authorization code to get tokens
    const tokens: any = await ms_auth_client.acquireTokenByCode(tokenRequest)

    //get the refresh tokens
    const tokenCache = ms_auth_client.getTokenCache().serialize()
    const refreshTokenObject = (JSON.parse(tokenCache)).RefreshToken
    let refreshToken = '';
    Object.entries( refreshTokenObject ).forEach( ( item : any )  => 
    {
        if ( item[1].home_account_id === tokens.account.homeAccountId )
        {
            refreshToken = item[1].secret;
        }
    });
    
    //check the database to see if the user already exists
    let userProfile = await UserProfile.getUserProfileByDriveId(tokens.idTokenClaims.sub)
    if(!userProfile){
        userProfile = await UserProfile.createUserProfile(
            tokens.idTokenClaims.sub,
            refreshToken,
            "MICROSOFT",
            tokens.idTokenClaims.name,
            tokens.idTokenClaims.preferred_username
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

export { login, auth_callback, auth_client, msLogin, msCallback }