const google = require('googleapis').google 
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose'
const jwt = require('jsonwebtoken')
const CONFIG = require('../configs.js')

const OAuth2 = google.auth.OAuth2
const auth_client = new OAuth2(
    CONFIG.oauth_credentials.client_id, 
    CONFIG.oauth_credentials.client_secret, 
    CONFIG.oauth_credentials.redirect_uris[0]
);

export const verifyToken = (req: any, res: any, next: NextFunction) => {
    try{
        const token = req.cookies.jwt
        if(!token){
            return res.status(400).json({
                message: "No Token Found",
            })
        }

        const decoded = jwt.verify(token, CONFIG.JWT_secret)
        req._id = new Types.ObjectId(decoded)
        next()
    }catch{
        return res.status(401).json({
            message: "Token cannot be verified."
        })
    }
}