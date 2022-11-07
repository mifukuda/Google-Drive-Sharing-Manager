import express from 'express';
import { createSnapshot, getSnapshotInfo, getSnap, updateSnap } from '../controllers';
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();

router.post('/create', verifyToken, createSnapshot)
router.get('/get', verifyToken, getSnap)
router.post('/update', verifyToken, updateSnap)
router.get('/getinfo', verifyToken, getSnapshotInfo)

export { router as snapshot_router };
