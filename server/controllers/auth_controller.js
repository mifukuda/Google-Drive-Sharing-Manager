const google = require('googleapis').google 
const CONFIG = require('../configs.js')
const jwt = require('jsonwebtoken');

// Create an OAuth2 client object for google
const OAuth2 = google.auth.OAuth2
const auth_client = new OAuth2(
    CONFIG.oauth_credentials.client_id, 
    CONFIG.oauth_credentials.client_secret, 
    CONFIG.oauth_credentials.redirect_uris[0]
);

login = (req, res) => {
    // Obtain the google login link 
    const auth_url = auth_client.generateAuthUrl({
        access_type: 'offline', // Does not require user to constantly give consent
        scope: CONFIG.oauth_credentials.scopes 
    });
    return res.redirect(auth_url);
}

auth_callback = (req, res) => {
    if(req.query.error){
        console.log("Error recieving Authorization Code")
        return res.redirect('/')
    }
    else {
        auth_client.getToken(req.query.code, function(err, token) {
            if(err) {
                console.log("Failed to get token.")
                return res.redirect('/')
            }
            res.cookie('jwt', jwt.sign(token, CONFIG.JWT_secret));
            return res.redirect('/testing');
        })
    }
}

module.exports = {
    login: login,
    auth_callback: auth_callback,
    auth_client: auth_client
}