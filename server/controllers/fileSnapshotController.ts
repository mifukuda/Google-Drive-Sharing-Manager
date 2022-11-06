import { Request, Response } from 'express';
import { GoogleDriveAdapter } from '../classes/DriveAdapter';
import { DriveRoot } from '../classes/FilesClasses';
import { FileInfoSnapshot } from '../classes/Structures';
import Models from '../db/Models';

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



const getSnap = (req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK'
    })
}

const updateSnap = (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}

export { createSnapshot, getSnap, updateSnap };
