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

app.listen(CONFIG.port, () => {
  console.log(`Server running on port ${CONFIG.port}`)
})
