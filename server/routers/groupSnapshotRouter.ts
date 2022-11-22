import express from "express";
import { uploadGroup, getGroupMembers } from "../controllers";
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();

router.post('/uploadgroupsnapshot', verifyToken, uploadGroup)
router.post('/getgroupmembers', verifyToken, getGroupMembers)

export { router as group_snapshot_router }