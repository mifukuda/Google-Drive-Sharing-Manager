const express = require('express')
const auth_controllers = require('../controllers/auth_controller.ts')

const router = express.Router()

router.get('/login', auth_controllers.login)
router.get('/callback', auth_controllers.auth_callback)

// module.exports = router
export { router as auth_router }