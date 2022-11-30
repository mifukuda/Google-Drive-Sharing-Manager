import express, { Router } from "express"
import { auth_callback, login, msLogin, msCallback } from "../controllers"

const router: Router = express.Router()

router.get('/login', login)
router.get('/callback', auth_callback)
router.get('/msLogin', msLogin)
router.get('/msCallback', msCallback)

export { router as auth_router }
