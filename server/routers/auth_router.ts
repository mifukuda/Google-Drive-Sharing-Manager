import express, { Router } from "express"
import { login, auth_callback } from "../controllers/auth_controller"

const router: Router = express.Router()

router.get('/login', login)
router.get('/callback', auth_callback)

export { router as auth_router }