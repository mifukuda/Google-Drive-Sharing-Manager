import express from 'express';
import { saveQuery, getSavedQueries, getAccessControlPolicies, addAccessControlPolicy, deleteAccessControlPolicy } from '../controllers';
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();

router.get('/getsavedqueries', verifyToken, getSavedQueries)
router.post('/savequery', verifyToken, saveQuery)
router.get('/getallacps', verifyToken, getAccessControlPolicies)
router.post('/addacp', verifyToken, addAccessControlPolicy)
router.post('/deleteacp', verifyToken, deleteAccessControlPolicy)

export { router as user_profile_router };