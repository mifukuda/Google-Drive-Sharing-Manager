//library imports
import { Request, Response } from 'express';
import { FileInfoSnapshot, DriveRoot, Query } from './DriveAdapter';
const express = require('express')
const cookie_parser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const {auth_client} = require('./controllers/auth_controller.ts')
const google = require('googleapis').google 
const {GoogleDriveAdapter, dummyTreeTest} = require('./DriveAdapter.ts')
const cors = require('cors');

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

// cors stuff
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3000/home'],
  credentials: true };
app.use(cors(corsOptions));

//installing custom middleware
app.use('/auth', auth_router)
app.use('/snapshot', snapshot_router)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Linux Stans!')
})

app.get('/api/getSnapshot', async (req: Request, res: Response) => {
  let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
  auth_client.setCredentials(decoded_token)
  let google_drive_adapter = new GoogleDriveAdapter()
  let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot(decoded_token)
  res.send({id: "", files: JSON.parse(snapshot.serialize()), filter: ""})
})

app.post('/api/query', async (req: Request, res: Response) => {
  console.log("query = " + req.body.query)
  let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
  auth_client.setCredentials(decoded_token)
  let google_drive_adapter = new GoogleDriveAdapter()
  let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot(decoded_token)
  let query = req.body.query
  let prop = query.split(":")[0]
  let val = query.split(":")[1]
  let drivefiles = snapshot.applyQuery(new Query(prop, val)).map(f => {
    return f.serialize()
  })
  res.send({id: "", files: drivefiles, filter: req.body.query})
})

app.get('/testing', async (req: Request, res: Response) => {
  res.send('Finally we have some identity.')
  let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
  auth_client.setCredentials(decoded_token)
  let google_drive_adapter = new GoogleDriveAdapter()
  let dummyRoot: DriveRoot = dummyTreeTest()
  // console.log(dummyRoot.toString(0))
  console.log(dummyRoot.toString(0))
  let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot(decoded_token)
  // console.log(snapshot.toString())
  // console.log(JSON.parse(snapshot.serialize()))
  // console.log(dummyRoot.children[0].serialize())
  console.log(dummyRoot.serialize())
})


app.listen(CONFIG.port, () => {
  console.log(`Server running on port ${CONFIG.port}`)
})
