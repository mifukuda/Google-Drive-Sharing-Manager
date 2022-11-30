//library imports
import cookie_parser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import db_connect from './db'
import { auth_router, snapshot_router, user_profile_router, group_snapshot_router } from './routers'

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
app.use('/user', user_profile_router)
app.use('/group', group_snapshot_router)

//connect to the database
db_connect()

app.get('/', async (req: Request, res: Response) => {
  return res.send("Hello Linux Stans")
})


app.listen(CONFIG.port, () => {
	console.log(`Server running on port ${CONFIG.port}`)
})
