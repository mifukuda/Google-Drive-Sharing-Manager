//library imports
const express = require('express')
const cookie_parser = require('cookie-parser')
// const jwt = require('jsonwebtoken');

//file imports
const CONFIG = require('./configs.js')
const auth_router = require('./routers/auth_router.js')

//starting the express server
const app = express()

//installing builtin middleware
app.use(cookie_parser())
app.use(express.json())

//installing custom middleware
app.use('/auth', auth_router)

app.get('/', (req, res) => {
  res.send('Hello Linux Stans!')
})

app.get('/login', (req, res) => {
    console.log('REQUEST RECIEVED')

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
})

app.listen(CONFIG.port, () => {
  console.log(`Server running on port ${CONFIG.port}`)
})
