const google = require('googleapis').google 
import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken')
const CONFIG = require('../configs.js')

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token: any = req.cookies.jwt
        if(!token){
            return res.status(400).json({
                message: "No Token Found",
            })
        }

        const decoded = jwt.verify(token, CONFIG.JWT_secret)
        // @ts-ignore
        req.cookies.jwt = decoded._id
        next()
    }catch (err){
        return res.status(401).json({
            message: "Token cannot be verified."
        })
    }
}