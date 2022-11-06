import express from 'express';
import { createSnapshot, getSnap, updateSnap } from '../controllers';
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();

router.post('/create', verifyToken, createSnapshot)
router.get('/get', verifyToken, getSnap)
router.post('/update', verifyToken, updateSnap)

export { router as snapshot_router };
