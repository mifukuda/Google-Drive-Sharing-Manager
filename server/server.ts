//library imports
import cookie_parser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { GoogleDriveAdapter } from './classes/DriveAdapter'
import { FileInfoSnapshot } from './classes/Structures'
import { Query } from './classes/UserClasses'
import { auth_client } from './controllers'
import db_connect from './db'
import Models from "./db/Models"
import { auth_router, snapshot_router } from './routers'

//file imports
const CONFIG = require('./configs.js');


//starting the express server
const app = express()

//installing builtin middleware
app.use(cookie_parser())
app.use(express.json())
app.use(fileUpload())


// cors stuff
const corsOptions = {
	origin: ['http://localhost:3000', 'http://localhost:3000/home'],
	credentials: true
}
app.use(cors(corsOptions));

//installing custom middleware
app.use('/auth', auth_router)
app.use('/fileSnapshot', snapshot_router)

//connect to the database
db_connect()

app.get('/', async (req: Request, res: Response) => {
	// {
	// 	access_token: 'ya29.a0Aa4xrXPRlM5Z4f6gAp0NS-ZoiG3WIagexdvFAP1J3GQyXIYnrwFpHHShf0cGnQh-LPLQTRWZV3yv-w7uB51YtionN90djL4oSJPC1yAdBBJN4bwVp-n9SGKwXqwlugXdZ2nuNDhVZVR8kvZvQCTKvP9tX_3xaCgYKATASARESFQEjDvL9W415OOyN9VWl5kWC_q7ajQ0163',
	// 	refresh_token: '1//0dgLjUOyAF20rCgYIARAAGA0SNwF-L9IrHUJXdPN1sDffhH7l5EmhiiY7RFRHpK6CcyC41clK5485p-a_3v9-epvqclSWfji6HWw',
	// 	scope: 'https://www.googleapis.com/auth/drive openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
	// 	token_type: 'Bearer',
	// 	id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3Y2MwZWY0YzcxODFjZjRjMGRjZWY3YjYwYWUyOGNjOTAyMmM3NmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MTI0MDY4NjA0Nzktcmo5bHV1NG1mb3NtN3FmaWtldHM1YnVuc2ZlbmNiZXUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MTI0MDY4NjA0Nzktcmo5bHV1NG1mb3NtN3FmaWtldHM1YnVuc2ZlbmNiZXUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTU0ODkxMDIxNjU4NjEwNzg0NzQiLCJlbWFpbCI6ImNob3dkaHVyeWFubm9vckBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImNBSkJYdW1wSF9DX204OEFOQkVBSVEiLCJuYW1lIjoiQ2hvd2RodXJ5IEFuLU5vb3IiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUxtNXd1My1MMUJuemRwZ2RWeXFYQjBuSHl4N2labUhzT3ZHR0x5eEpvbWw9czk2LWMiLCJnaXZlbl9uYW1lIjoiQ2hvd2RodXJ5IiwiZmFtaWx5X25hbWUiOiJBbi1Ob29yIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NjczNTYzNzIsImV4cCI6MTY2NzM1OTk3Mn0.H3VbBxv_4UAAAovSB4RUipDFbxkXS_Xy1uT6qte9h5RV0uti49_LWnsndJrakzmTzTtqSRpZw7AWmFYRA_T6a5HDeCh0a1-zL10u4eCioU8eZ4CI9s3KhjnC4uRmduq3B7c0lViD5x0tlFKbQmGsWfPZiAgJVpYIMQcdcUp8x2Vx10JLXTYHWD9lzmfUoLPqmyud826NKv4PP9FOwThyXp8a_rnwozgOMyrtegrSvBNLSzq_ROtM_iM8Mdlh-O0p_CR1Si_FuD41VAuwYcPhPcVq8-n_YsTHWYLbT-SEjS9VH8cNGROKrf0wiKUuDqs75nZjBLWBOdXr1DcagcGmKw',
	// 	expiry_date: 1667359971709
	// }
	//   auth_client.setCredentials({ refresh_token : "1//0dgLjUOyAF20rCgYIARAAGA0SNwF-L9IrHUJXdPN1sDffhH7l5EmhiiY7RFRHpK6CcyC41clK5485p-a_3v9-epvqclSWfji6HWw"})
	//   let adapter = new GoogleDriveAdapter("1//0dgLjUOyAF20rCgYIARAAGA0SNwF-L9IrHUJXdPN1sDffhH7l5EmhiiY7RFRHpK6CcyC41clK5485p-a_3v9-epvqclSWfji6HWw")
	//   let snapshot: FileInfoSnapshot = await adapter.createFileInfoSnapshot()
	//   // const serializedSnapshot = snapshot.serialize()
	//   let saved_snapshot_id: any = await snapshot.save(err => {
	// 	console.log(err)
	//   })
	  // console.log(snapshot._id)
	  // FileInfoSnapshot.retrieve(snapshot._id)
	return res.send("Hello Linux Stans")
})

// app.post('/uploadgroup', function (req, res) {
// 	if (!req.files || Object.keys(req.files).length === 0) {
// 		return res.status(400).send('No files were uploaded.');
// 	}
// 	// let group: GroupMembershipSnapshot = new GroupMembershipSnapshot("somename", req.files.memberlist as UploadedFile, new Date())
// 	// console.log(group.members)
// })

// app.get('/api/getSnapshot', async (req: Request, res: Response) => {
// 	let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
// 	auth_client.setCredentials({
// 		access_token: 'ya29.a0Aa4xrXNkfs3sMXTnKsPOQIONrJ8TZx1Wwj4p5NCo030PX8xHGn1faqjkYKXlcCja_kipLwKGw1ssj9jneol_XudKIBa2U_iVnqQyxnAjIVLbFKe196_g6Mxv6_Y9Nj6SLCQ4rXWoqxmnSKS3Yuf_vBTa3icVaCgYKATASARESFQEjDvL9TvTVkKhsVcyWVsq_CgGX5A0163',
// 		refresh_token: '1//0dRRNXm4UuUpwCgYIARAAGA0SNwF-L9Ir8OSoYJoJNBZhTbmsM6m9I3k5-kWxMA_IemDuTz6hMPH2ASkoGrHylVVybxyPqR8x0os',
// 		scope: 'https://www.googleapis.com/auth/drive',
// 		token_type: 'Bearer',
// 		expiry_date: 1667006287058
// 	})
// 	let google_drive_adapter = new GoogleDriveAdapter("hello")
// 	let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot()
// 	const serializedSnapshot = snapshot.serialize()
// 	snapshot.save(err => {
// 		console.log(err)
// 	})
// 	res.send({ id: "", files: serializedSnapshot, filter: "" })
// })

// app.post('/api/query', async (req: Request, res: Response) => {
// 	console.log("query = " + req.body.query)
// 	let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
// 	auth_client.setCredentials(decoded_token)
// 	let google_drive_adapter = new GoogleDriveAdapter("heyo")
// 	let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot()
// 	let query = req.body.query
// 	let prop = query.split(":")[0]
// 	let val = query.split(":")[1]
// 	let drivefiles = snapshot.applyQuery(new Query(prop, val)).map(f => {
// 		return f.serialize()
// 	})
// 	console.log(drivefiles)
// 	res.send({ id: "", files: drivefiles, filter: req.body.query })
// })

// app.get('/testing', async (req: Request, res: Response) => {
// 	res.send('Finally we have some identity.')
// 	let decoded_token = jwt.decode(req.cookies.jwt, CONFIG.JWT_secret)
// 	auth_client.setCredentials(decoded_token)
// 	// let google_drive_adapter = new GoogleDriveAdapter()
// 	// let dummyRoot: DriveRoot = dummyTreeTest()
// 	// console.log(dummyRoot.toString(0))
// 	// console.log(dummyRoot.toString(0))
// 	// let snapshot: FileInfoSnapshot = await google_drive_adapter.createFileInfoSnapshot(decoded_token)
// 	// console.log(snapshot.toString())
// 	// console.log(JSON.parse(snapshot.serialize()))
// 	// console.log(dummyRoot.children[0].serialize())
// 	// console.log(dummyRoot.serialize())
// })


app.listen(CONFIG.port, () => {
	console.log(`Server running on port ${CONFIG.port}`)
})
