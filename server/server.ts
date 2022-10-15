//library imports
import { Request, Response } from 'express';
const express = require('express')
const cookie_parser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const {auth_client} = require('./controllers/auth_controller.ts')
const google = require('googleapis').google 
const {GoogleDriveAdapter, dummyTreeTest} = require('./DriveAdapter.ts')

//file imports
const CONFIG = require('./configs.js')
import { auth_router } from './routers/auth_router'
import { snapshot_router } from './routers/snapshot_router'
const { response } = require('express');

//starting the express server
const app = express()

//installing builtin middleware
app.use(cookie_parser())
app.use(express.json())

//installing custom middleware
app.use('/auth', auth_router)
app.use('/snapshot', snapshot_router)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Linux Stans!')
})

app.get('/testing', async (req: Request, res: Response) => {
  res.send('Finally we have some identity.')
  let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
  auth_client.setCredentials(decoded_token)
  let google_drive_adapter = new GoogleDriveAdapter()
  console.log(dummyTreeTest().toString(0))
  console.log((await google_drive_adapter.createFileInfoSnapshot(decoded_token)).toString())
})


app.listen(CONFIG.port, () => {
  console.log(`Server running on port ${CONFIG.port}`)
})
