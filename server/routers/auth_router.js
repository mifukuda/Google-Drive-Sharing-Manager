const express = require('express')
const auth_controllers = require('../controllers/auth_controller.js')
const testing = require('../auth')

const router = express.Router()

router.get('/login', testing.verifyToken, auth_controllers.login)
router.get('/callback', auth_controllers.auth_callback)

module.exports = router