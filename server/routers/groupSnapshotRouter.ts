import express from "express";
import { uploadGroup } from "../controllers";
import fileUpload from 'express-fileupload'
import { verifyToken } from '../middleware/jwtVerification';

const router = express.Router();
// router.use(fileUpload())

router.post('/uploadgroupsnapshot', verifyToken, uploadGroup)

export { router as group_snapshot_router }