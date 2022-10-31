//library imports
import { Request, Response } from 'express'
import { FileInfoSnapshot } from './classes/FileInfoSnapshot'
import { Query } from './classes/Query'
import { GoogleDriveAdapter } from './classes/DriveAdapter'
import express from 'express'
import cookie_parser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import fileUpload, { UploadedFile } from 'express-fileupload'

//file imports
const CONFIG = require('./configs.js');
import { auth_router } from './routers/auth_router'
import { snapshot_router } from './routers/snapshot_router'
import { auth_client } from './controllers/auth_controller'
import db_connect from './db'
import Models from "./db/Models"

//starting the express server
const app = express()

//installing builtin middleware
app.use(cookie_parser())
app.use(express.json())
app.use(fileUpload())


// cors stuff
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3000/home'],
  credentials: true }
app.use(cors(corsOptions));

//installing custom middleware
app.use('/auth', auth_router)
app.use('/snapshot', snapshot_router)

//connect to the database
db_connect()

app.get('/', async (req: Request, res: Response) => {
  const file = new Models.FileModel(
    {
      drive_id: "Mooooooooo",
      name: "File1",
      owner: "Omar's left nut",
      sharedBy: "Omar's left nut",
      mime_type: "file",
      permissions: [],
      children: [], 
    }
  )

  // const user: any = await userModel.findOne({name:"Omar"})
  // const fileSanpshot: any = new Models.FileSnapshotModel(
  //   {
  //     user_id: user._id,
  //     files: [file]
  //   }
  // ).save()
  //   .then(async () => {
  //     const snapshot: any = await FileSnapshotModel.findOne()
  //     console.log(snapshot)
  //     return res.status(200).json({})
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     return res.status(400).json({
  //       success: 'false',
  //       user: null
  //     })
  //   })
  console.log(typeof file)
  return res.send("Hello Linux Stans")
})

app.post('/uploadgroup', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // let group: GroupMembershipSnapshot = new GroupMembershipSnapshot("somename", req.files.memberlist as UploadedFile, new Date())
  // console.log(group.members)
})

app.get('/api/getSnapshot', async (req: Request, res: Response) => {
  let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
  auth_client.setCredentials({
    access_token: 'ya29.a0Aa4xrXNkfs3sMXTnKsPOQIONrJ8TZx1Wwj4p5NCo030PX8xHGn1faqjkYKXlcCja_kipLwKGw1ssj9jneol_XudKIBa2U_iVnqQyxnAjIVLbFKe196_g6Mxv6_Y9Nj6SLCQ4rXWoqxmnSKS3Yuf_vBTa3icVaCgYKATASARESFQEjDvL9TvTVkKhsVcyWVsq_CgGX5A0163',
    refresh_token: '1//0dRRNXm4UuUpwCgYIARAAGA0SNwF-L9Ir8OSoYJoJNBZhTbmsM6m9I3k5-kWxMA_IemDuTz6hMPH2ASkoGrHylVVybxyPqR8x0os',
    scope: 'https://www.googleapis.com/auth/drive',
    token_type: 'Bearer',
    expiry_date: 1667006287058
  })
  let google_drive_adapter = new GoogleDriveAdapter("hello")
  let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot()
  const serializedSnapshot = snapshot.serialize()
  snapshot.save(err => {
    console.log(err)
  })
  res.send({id: "", files: serializedSnapshot, filter: ""})
})

app.post('/api/query', async (req: Request, res: Response) => {
  console.log("query = " + req.body.query)
  let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
  auth_client.setCredentials(decoded_token)
  let google_drive_adapter = new GoogleDriveAdapter("heyo")
  let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot()
  let query = req.body.query
  let prop = query.split(":")[0]
  let val = query.split(":")[1]
  let drivefiles = snapshot.applyQuery(new Query(prop, val)).map(f => {
    return f.serialize()
  })
  console.log(drivefiles)
  res.send({id: "", files: drivefiles, filter: req.body.query})
})

app.get('/testing', async (req: Request, res: Response) => {
  res.send('Finally we have some identity.')
  let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
  auth_client.setCredentials(decoded_token)
  // let google_drive_adapter = new GoogleDriveAdapter()
  // let dummyRoot: DriveRoot = dummyTreeTest()
  // console.log(dummyRoot.toString(0))
  // console.log(dummyRoot.toString(0))
  // let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot(decoded_token)
  // console.log(snapshot.toString())
  // console.log(JSON.parse(snapshot.serialize()))
  // console.log(dummyRoot.children[0].serialize())
  // console.log(dummyRoot.serialize())
})


app.listen(CONFIG.port, () => {
  console.log(`Server running on port ${CONFIG.port}`)
})
