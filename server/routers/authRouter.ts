import express, { Router } from "express"
import { auth_callback, login } from "../controllers"

const router: Router = express.Router()

router.get('/login', login)
router.get('/callback', auth_callback)

export { router as auth_router }
