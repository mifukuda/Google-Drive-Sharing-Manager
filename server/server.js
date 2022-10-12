//library imports
const express = require('express')
const cookie_parser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const {auth_client} = require('./controllers/auth_controller.js')
const google = require('googleapis').google 
const {GoogleDriveAdapter} = require('./DriveAdapter.ts')

//file imports
const CONFIG = require('./configs.js')
const auth_router = require('./routers/auth_router.js');
const { response } = require('express');

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

app.get('/testing', async (req, res) => {
  res.send('Finally we have some identity.')
  let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
  auth_client.setCredentials(decoded_token)
  let google_drive_adapter = new GoogleDriveAdapter()
  google_drive_adapter.createFileInfoSnapshot(decoded_token)
})


app.listen(CONFIG.port, () => {
  console.log(`Server running on port ${CONFIG.port}`)
})
