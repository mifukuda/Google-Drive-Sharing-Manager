const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Linux Stans!')
})

app.listen(port, () => {
  console.log(`Your first Express app is successfully running! You can view the output of this app at http://localhost:${port}`)
})
