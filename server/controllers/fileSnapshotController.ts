import { Request, Response } from 'express';
import { GoogleDriveAdapter } from '../classes/DriveAdapter';
import { DriveRoot } from '../classes/FilesClasses';
import { FileInfoSnapshot } from '../classes/Structures';
import { Query } from '../classes/UserClasses'
import Models from '../db/Models';
import { Types } from 'mongoose';

const createSnapshot = async (req: Request, res: Response) => {
    //get the user UserProfile
    let user: any = null
    try{
        user = await Models.UserModel.findById((req.cookies.jwt))
    }catch(err){
        console.log("Error querying user profile.", err)
        return res.status(400).json({status: "Failed"})
    }

    //create the snapshot
    const drive = new GoogleDriveAdapter(user.driveToken)
    const roots: DriveRoot[] = await drive.getFileRoots()
    console.log(roots)
    const fileSnapshot: FileInfoSnapshot = await FileInfoSnapshot.createNew(user._id, roots)

    //update and save the user userProfile
    user.fileSnapshots.push(fileSnapshot._id)
    try{
        user = await user.save()
    }catch(err){
        console.log("Error saving user profile.", err)
        return res.status(400).json({message: "Failed"})
    }

    console.log(fileSnapshot)
    //serilize the snapshot and return
    return res.status(201).json({
        message: "OK",
        fileSnapshot: fileSnapshot.serialize()
    })
}


const getSnapshotInfo = async (req: Request, res: Response) => {
    let user: any = await Models.UserModel.findById((req.cookies.jwt)).populate({ path: 'fileSnapshots', model: 'FileSnapshots' })
    let snapshot_info = user.fileSnapshots.map((s: any) => { return { "_id": s.id, "createdAt": s.createdAt }})
    res.status(200).json({ message: "OK", snapshotInfo: snapshot_info })
}


const getSnap = async (req: Request, res: Response) => {
    let id = new Types.ObjectId(req.body.id)
    let fileSnapshot = await FileInfoSnapshot.retrieve(id)
    return res.status(200).json({
        message: "OK",
        fileSnapshot: fileSnapshot.serialize()
    })
}

const updateSnap = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

const checkPolicies = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

const analyzeSharing = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

const querySnap = async (req: Request, res: Response) => {
    let query = req.body.query
    let prop = query.split(":")[0]
    let val = query.split(":")[1]
    let id = new Types.ObjectId(req.body.id)
    let fileSnapshot = await FileInfoSnapshot.retrieve(id)
    let query_results = fileSnapshot.applyQuery(new Query(prop, val)).map(f => {
        return f.serialize()
    })
    res.status(200).json({
        message: "OK",
        query_results: query_results
    })
}


export { createSnapshot, getSnap, updateSnap, getSnapshotInfo, checkPolicies, analyzeSharing, querySnap };