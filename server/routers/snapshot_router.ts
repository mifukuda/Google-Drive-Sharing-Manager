const express = require('express')
const snapshot_controller = require('../controllers/snapshot_controller.ts')
import { verifyToken } from '../auth'

const router = express.Router();

router.get('/getSnap', verifyToken, snapshot_controller.getSnap)
router.post('/saveSnap', verifyToken, snapshot_controller.saveSnap)

export { router as snapshot_router}