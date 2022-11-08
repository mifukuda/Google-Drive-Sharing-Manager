import express from 'express';
import { saveQuery, getAccessControlPolicies, addAccessControlPolicy, deleteAccessControlPolicy } from '../controllers';
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();

router.post('/savequery', verifyToken, saveQuery)
router.post('/getacp', verifyToken, getAccessControlPolicies)
router.post('/addacp', verifyToken, addAccessControlPolicy)
router.post('/deleteacp', verifyToken, deleteAccessControlPolicy)

export { router as user_profile_router };