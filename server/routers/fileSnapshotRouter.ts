import express from 'express';
import { createSnapshot, getSnapshotInfo, getSnap, updateSnap, checkPolicies, querySnap, deviantSharing, sharingDifferences, sharingChanges} from '../controllers';
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();

router.get('/create', verifyToken, createSnapshot)
router.post('/get', verifyToken, getSnap)
router.post('/update', verifyToken, updateSnap)
router.get('/getinfo', verifyToken, getSnapshotInfo)
router.post('/checkpolicies', verifyToken, checkPolicies)
router.post('/analyze/deviantSharing', verifyToken, deviantSharing)
router.post('/analyze/sharingDifferences', verifyToken, sharingDifferences)
router.post('/analyze/sharingChanges', verifyToken, sharingChanges)
router.post('/query', verifyToken, querySnap)

export { router as snapshot_router };