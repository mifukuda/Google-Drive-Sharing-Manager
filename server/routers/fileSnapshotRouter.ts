import express from 'express';
import { createSnapshot, getSnapshotInfo, getSnap, updateSnap, checkPolicies, analyzeSharing, querySnap, deviantSharing} from '../controllers';
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();

router.post('/create', verifyToken, createSnapshot)
router.get('/get', verifyToken, getSnap)
router.post('/update', verifyToken, updateSnap)
router.get('/getinfo', verifyToken, getSnapshotInfo)
router.get('/checkpolicies', verifyToken, checkPolicies)
router.get('/analyze/deviantSharing', verifyToken, deviantSharing)
router.get('/analyze/sharingDifferences', verifyToken, analyzeSharing)
router.get('/query', verifyToken, querySnap)

export { router as snapshot_router };