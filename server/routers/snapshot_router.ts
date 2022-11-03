import express from 'express';
import { getSnap, saveSnap } from '../controllers/fileSnapshotController';
import { verifyToken } from '../middleware/jwtVerification'

const router = express.Router();

router.get('/getSnap', verifyToken, getSnap)
router.post('/saveSnap', verifyToken, saveSnap)

export { router as snapshot_router}