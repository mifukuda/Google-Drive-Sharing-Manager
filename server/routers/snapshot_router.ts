import express from 'express';
import { getSnap, saveSnap } from '../controllers/snapshot_controller';
import { verifyToken } from '../auth'

const router = express.Router();

router.get('/getSnap', verifyToken, getSnap)
router.post('/saveSnap', verifyToken, saveSnap)

export { router as snapshot_router}