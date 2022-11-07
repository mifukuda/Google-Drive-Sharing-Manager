import express from 'express';
import { createSnapshot, getSnapshotInfo, getSnap, updateSnap, checkPolicies, analyzeSharing, querySnap, deviantSharing, sharingDifferences} from '../controllers';
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();

router.post('/create', verifyToken, createSnapshot)
router.get('/get', verifyToken, getSnap)
router.post('/update', verifyToken, updateSnap)
router.get('/getinfo', verifyToken, getSnapshotInfo)
router.get('/checkpolicies', verifyToken, checkPolicies)
router.post('/analyze/deviantSharing', verifyToken, deviantSharing)
router.post('/analyze/sharingDifferences', verifyToken, sharingDifferences)
router.get('/query', verifyToken, querySnap)

export { router as snapshot_router };