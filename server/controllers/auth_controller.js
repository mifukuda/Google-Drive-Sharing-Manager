const google = require('googleapis').google 
const CONFIG = require('../configs.js')

login = (req, res) => {
    // Create an OAuth2 client object
    const OAuth2 = google.auth.OAuth2
    const auth_client = new OAuth2(
        CONFIG.oauth_credentials.client_id, 
        CONFIG.oauth_credentials.client_secret, 
        CONFIG.oauth_credentials.redirect_uris[0]
    );
    
    // Obtain the google login link 
    const auth_url = auth_client.generateAuthUrl({
        access_type: 'offline', //Does not require user to constantly give consent
        scope: CONFIG.oauth_credentials.scopes 
    });

    return res.redirect(auth_url);
}

auth_callback = (req, res) => {

}

module.exports = {
    login: login,
    auth_callback: auth_callback
}