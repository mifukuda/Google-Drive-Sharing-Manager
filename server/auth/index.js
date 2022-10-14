const google = require('googleapis').google 
const jwt = require('jsonwebtoken')
const CONFIG = require('../configs.js')

const OAuth2 = google.auth.OAuth2
const auth_client = new OAuth2(
    CONFIG.oauth_credentials.client_id, 
    CONFIG.oauth_credentials.client_secret, 
    CONFIG.oauth_credentials.redirect_uris[0]
);

const verifyToken = (req, res, next) => {
    try{
        const token = req.cookies.jwt
        if(!token){
            res.return(400).json({
                message: "No Token Found",
            })
        }

        const decoded = jwt.verify(token, CONFIG.JWT_secret)
        req.accessToken = decoded
        next()
    }catch{
        res.return(401).json({
            message: "Token cannot be verified."
        })
    }
}

module.exports = {
    verifyToken: verifyToken
}