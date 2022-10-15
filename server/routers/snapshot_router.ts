const express = require('express')
const snapshot_controller = require('../controllers/snapshot_controller.ts')

const router = express.Router();

router.get('/getSnap', snapshot_controller.getSnap)
router.post('/saveSnap', snapshot_controller.saveSnap)

export { router as snapshot_router}