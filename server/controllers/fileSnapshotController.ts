import { Request, response, Response } from 'express';
import { GoogleDriveAdapter } from '../classes/DriveAdapter';
import { DriveRoot, DriveFile, DriveFolder } from '../classes/FilesClasses';
import { FileInfoSnapshot, googleDrivePermissionToOurs, Permission } from '../classes/Structures';
import { Query } from '../classes/UserClasses'
import Models from '../db/Models';
import { Types } from 'mongoose';
import { getModel } from '../middleware/getUserModel'
import { analyzeDeviantSharing, calculatePermissionDifferences, calculateSharingChanges } from '../sharinganalysis'
import { driveUserModel } from '../db/Models/DriveUserSchema';
import { MSDriveAdapter } from '../classes/DriveAdapter/MSDriveAdapter';


const createSnapshot = async (req: Request, res: Response) => {
    //get the user UserProfile
    let user: any = await getModel(req.cookies.jwt)

    //create the snapshot
    let drive: any = 0;
    if(user.driveType === 'MICROSOFT')
        drive = new MSDriveAdapter(user.driveToken)
    else
        drive = new GoogleDriveAdapter(user.driveToken)
    
    const roots: DriveRoot[] = await drive.getFileRoots()
    const fileSnapshot: FileInfoSnapshot = await FileInfoSnapshot.createNew(user._id, roots)

    //update and save the user userProfile
    user.fileSnapshots.push(fileSnapshot._id)
    try{
        user = await user.save()
    }catch(err){
        console.log("Error saving user profile.", err)
        return res.status(400).json({message: "Failed"})
    }

    // console.log(fileSnapshot)
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
    // console.log("serialized SNPASHOT: " , JSON.stringify(fileSnapshot.serialize(), null, "\t"))
    return res.status(200).json({
        message: "OK",
        fileSnapshot: fileSnapshot.serialize()
    })
}

const updateSnap = async (req: Request, res: Response) => {
    let { snapshotID, fileDbIDs, operation, emails } = req.body
    console.log("filedbids: ", fileDbIDs)
    let user: any = await getModel(req.cookies.jwt)
    const drive = new GoogleDriveAdapter(user.driveToken)
    if (operation === "add_readers" || operation === "add_writers" || operation === "add_commenters") {
        if (!emails || emails.length === 0) return res.status(400).json({ message: "emails must be provided for this operation" })
        let role = ""
        if (operation === "add_readers")
            role = "reader"
        if (operation === "add_writers") 
            role = "writer"
        if (operation === "add_commenters")
            role = "commenter"
        for (let i = 0; i < fileDbIDs.length; i++) {
            let fileDbID = fileDbIDs[i]
            let snapshotModel = await Models.FileSnapshotModel.findById(new Types.ObjectId(snapshotID))
            let fileModel = snapshotModel?.files.id(new Types.ObjectId(fileDbID))
            let fileDriveID = fileModel?.drive_id
            if (!fileDriveID) return res.status(400).json({ message: "could not find file in database." })
            for (let j = 0; j < emails.length; j++) {
                let email = emails[j]
                let response = await drive.addPermission(fileDriveID, email, role)
                let mutatingDb: boolean = false
                fileModel?.permissions.forEach(p => {
                    if (p.drive_id === response.data.id) {
                        p.role = googleDrivePermissionToOurs[response.data.role]
                        mutatingDb = true
                    }
                })
                if (!mutatingDb) {
                    console.log("response = ", response)
                    let { id, role, emailAddress, displayName }  = response.data
                    fileModel?.permissions.push(new Models.PermissionModel({ drive_id: id, grantedTo: new driveUserModel({ email: emailAddress, display_name: displayName}), role: googleDrivePermissionToOurs[role]}))
                }
                await snapshotModel?.save()
            }
        }
    }
        if (operation === "unshare") {
            for (let i = 0; i < fileDbIDs.length; i++) {
                let fileDbID = fileDbIDs[i]
                let snapshotModel = await Models.FileSnapshotModel.findById(new Types.ObjectId(snapshotID))
                if (!snapshotModel) return res.status(400).json({ message: "snapshot not found in database"})
                let fileModel = snapshotModel.files.id(new Types.ObjectId(fileDbID))
                if (!fileModel) return res.status(400).json({ message: "file not found in database"})
                let owner = fileModel.owner
                if (!owner) return res.status(400).json({ message: "file has no owner"})
                let fileDriveID = fileModel.drive_id
                let len = fileModel.permissions?.length as number
                console.log("len: ", len)
                for (let j = len-1; j >= 0;  j--) {
                    let perm = fileModel.permissions[j]
                    if (perm.grantedTo?.email != owner.email) {
                        await drive.deletePermission(fileDriveID, perm.drive_id)
                        fileModel.permissions.splice(j, 1)
                    }
                }
                await snapshotModel.save()
            }
        }
        if (operation === "remove_readers" || operation === "remove_writers" || operation === "remove_commenters") {
            let role = ""
            if (operation === "remove_readers")
                role = "reader"
            if (operation === "remove_writers") 
                role = "writer"
            if (operation === "remove_commenters")
                role = "commenter"
            for (let i = 0; i < fileDbIDs.length; i++) {
                let fileDbID = fileDbIDs[i]
                let snapshotModel = await Models.FileSnapshotModel.findById(new Types.ObjectId(snapshotID))
                if (!snapshotModel) return res.status(400).json({ message: "snapshot not found in database"})
                let fileModel = snapshotModel.files.id(new Types.ObjectId(fileDbID))
                if (!fileModel) return res.status(400).json({ message: "file not found in database"})
                let owner = fileModel.owner
                if (!owner) return res.status(400).json({ message: "file has no owner"})
                let fileDriveID = fileModel.drive_id
                let len = fileModel.permissions?.length as number
                for (let j = len-1; j >= 0;  j--) {
                    let perm = fileModel.permissions[j]
                    for (let k = 0; k < emails.length; k++) {
                        let email = emails[k]
                        if (email === perm.grantedTo?.email && perm.role === googleDrivePermissionToOurs[role]) {
                            await drive.deletePermission(fileDriveID, perm.drive_id)
                            fileModel.permissions.splice(j, 1)
                        }
                    }
                }
                await snapshotModel.save()
            }
        }
    res.status(200).json({ message: "success"})
}

const checkPolicies = async (req: Request, res: Response) => {
    const { snapshot_id, acp_ids } = req.body
    let response_body: any[] = []
    let user: any = await getModel(req.cookies.jwt)
    if (!user) return res.status(400).json({ message: "user not found in database" })
    let fileSnapshot: FileInfoSnapshot = await FileInfoSnapshot.retrieve(snapshot_id)
    if (!fileSnapshot) return res.status(400).json({ message: "file snapshot not found in database" })
    acp_ids.forEach((acp_id: string) => {
        let violations: any[] = []
        let acp: any = user.AccessControlPolicy.find((acp: any) => acp._id.toString() === acp_id)
        if (!acp) console.log("WARNING: ACP not found in database for current user , skipping")
        let [prop, val] = acp.query.split(":")
        let queried_files = fileSnapshot.applyQuery(new Query(prop, val))
        let AR: Set<string> = new Set(acp.AR)
        let DR: Set<string> = new Set(acp.DR)
        let AW: Set<string> = new Set(acp.AW)
        let DW: Set<string> = new Set(acp.DW)
        queried_files.forEach((file: DriveFile) => {
            file.permissions.forEach((p: Permission) => {
                if (p.role >= googleDrivePermissionToOurs["reader"]) {
                    if (DR.size > 0 && DR.has(p.granted_to.email))  // if someone is in DR, they can't be a reader or higher
                        violations.push({ set: "DR", file_name: file.name, violating_permission: p })
                    if (AR.size > 0 && !AR.has(p.granted_to.email)) 
                        violations.push({ set: "AR", file_name: file.name, violating_permission: p })
                }
                if (p.role >= googleDrivePermissionToOurs["writer"]) {
                    if (DW.size > 0 && DW.has(p.granted_to.email))  // if someone is in DW, they CAN be a reader, but NOT a writer or higher
                        violations.push({ set: "DW", file_name: file.name, violating_permission: p })
                    if (AW.size > 0 && !AW.has(p.granted_to.email)) 
                        violations.push({ set: "AW", file_name: file.name, violating_permission: p })
                }
            })
        })
        response_body.push({ id: acp_id, violations: violations})
    })
    return res.status(200).json(response_body)
}

const analyzeSharing = async (req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK' 
    })
}


const deviantSharing = async (req: Request, res: Response) => {
    console.log("analyzing deviant sharing.")

    let user: any = await getModel(req.cookies.jwt)

    const id = new Types.ObjectId(req.body.id)
    console.log("snapshot Id: ", id)
    const fileSnapshot = await FileInfoSnapshot.retrieve(id)
    let all_files: DriveFile[] = fileSnapshot.drive_roots
    if(all_files !== null){

        all_files= all_files.flatMap((d: DriveFile) => d.getSubtree())   
        let result = analyzeDeviantSharing(all_files, req.body.threshold)
        
        let response : any = {}
        response.instances = []
        for(const key of result.keys()){
            let instance : any = {}
            instance.majorityPermission = key
            instance.deviantlyShared = result.get(key)
            response.instances.push(instance)
        }

        console.log("done")
        res.send(response)
    }
}

const sharingDifferences = async (req: Request, res: Response) => {
    console.log("analyzing sharing differences.")

    let user: any = await getModel(req.cookies.jwt)

    const id = new Types.ObjectId(req.body.id)
    console.log("snapshot Id: ", id)
    const fileSnapshot = await FileInfoSnapshot.retrieve(id)
    let all_files: DriveFile[] = fileSnapshot.drive_roots
    if(all_files !== null){
        
        all_files= all_files.flatMap((d: DriveFile) => d.getSubtree())   
        let result = calculatePermissionDifferences(all_files)

        let response : any = {}
        response.instances = []
        for(const key of result.keys()){
            let instance : any = {}
            instance.parent = key
            instance.children = result.get(key)
            response.instances.push(instance)
        }

        console.log("done")
        res.send(response)
        
    }

  
}  

const sharingChanges = async (req: Request, res: Response) => {
    console.log("analyzing sharing changes.")

    let user: any = await getModel(req.cookies.jwt)

    const id1 = new Types.ObjectId(req.body.id1)
    const id2 = new Types.ObjectId(req.body.id2)
    console.log("snapshot Id: ", id1, "snapshot Id2: ", id2)

    const fileSnapshot1 = await FileInfoSnapshot.retrieve(id1)
    let all_files1: DriveFile[] = fileSnapshot1.drive_roots

    const fileSnapshot2 = await FileInfoSnapshot.retrieve(id2)
    let all_files2: DriveFile[] = fileSnapshot2.drive_roots

    if(all_files1 !== null && all_files2 !== null){
        
        all_files1 = all_files1.flatMap((d: DriveFile) => d.getSubtree())   
        all_files2 = all_files2.flatMap((d: DriveFile) => d.getSubtree())   
        
        let result: any = calculateSharingChanges(all_files1, all_files2)

        let response : any = {}
        response.instances = []
        for(const key of result.keys()){
            let instance : any = {}
            instance.file = key
            instance.oldPermissions = result.get(key)[1]
            instance.newPermissions = result.get(key)[0]
            response.instances.push(instance)
        }

        console.log("done")
        res.send(response)
        
    }
    
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
        query: query,
        query_results: query_results
    })
}


export { createSnapshot, getSnap, updateSnap, getSnapshotInfo, checkPolicies, analyzeSharing, querySnap, deviantSharing, sharingDifferences, sharingChanges };