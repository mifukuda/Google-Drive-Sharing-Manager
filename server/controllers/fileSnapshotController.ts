import { Request, Response } from 'express';
import { GoogleDriveAdapter } from '../classes/DriveAdapter';
import { DriveRoot, DriveFile, DriveFolder } from '../classes/FilesClasses';
import { FileInfoSnapshot } from '../classes/Structures';
import { Query } from '../classes/UserClasses'
import Models from '../db/Models';
import { Types } from 'mongoose';
import { getModel } from '../middleware/getUserModel'
import { analyzeDeviantSharing, calculatePermissionDiffences } from '../sharinganalysis'


const createSnapshot = async (req: Request, res: Response) => {
    //get the user UserProfile
    let user: any = await getModel(req.cookies.jwt)

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
    if (!user) {
        console.log("User not found.")
        return res.status(400).json({message: "Failed"})
    }
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

const deviantSharing = async (req: Request, res: Response) => {
    console.log("analyzing deviant sharing.")

    let user: any = await getModel(req.cookies.jwt)

    let google_drive_adapter = new GoogleDriveAdapter(user.driveToken)
    // let snapshot: DriveFile[] = await google_drive_adapter.getFileRoots()
    // let all_files: DriveFile[] = snapshot.drive_roots.flatMap((d: DriveRoot) => d.getSubtree())   
    let all_files: DriveFile[] = await google_drive_adapter.getFileRoots()

    let x = analyzeDeviantSharing(all_files, req.body.threshold)
  
    console.log(x)
    console.log("done")
    res.send([...x])
}

const sharingDifferences = async (req: Request, res: Response) => {
    console.log("analyzing sharing differences.")

    let user: any = await getModel(req.cookies.jwt)

    let google_drive_adapter = new GoogleDriveAdapter(user.driveToken)
    // let snapshot: DriveFile[] = await google_drive_adapter.getFileRoots()
    // let all_files: DriveFile[] = snapshot.drive_roots.flatMap((d: DriveRoot) => d.getSubtree())   
    let all_files: DriveFile[] = await google_drive_adapter.getFileRoots()

    let x = calculatePermissionDiffences(all_files)
  
    console.log(x)
    console.log("done")
    res.send([...x])
}  

const querySnap = async (req: Request, res: Response) => {
    let query = req.body.query
    let prop = query.split(":")[0]
    let val = query.split(":")[1]
    let id = new Types.ObjectId(req.body.snapshot_id)
    let query_results
    try {
        let fileSnapshot = await FileInfoSnapshot.retrieve(id)
        query_results = fileSnapshot.applyQuery(new Query(prop, val)).map(f => {
            return f.serialize()
        })
    } catch (err) {
        return res.status(400).json({message: "Failed"}) 
    }
    res.status(200).json({
        message: "OK",
        query_results: query_results
    })
}


export { createSnapshot, getSnap, updateSnap, getSnapshotInfo, checkPolicies, analyzeSharing, querySnap, deviantSharing, sharingDifferences };