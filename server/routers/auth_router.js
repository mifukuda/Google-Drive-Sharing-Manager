const express = require('express')
const auth_controllers = require('../controllers/auth_controller.js')

const router = express.Router()

router.get('/login', auth_controllers.login)

module.exports = router