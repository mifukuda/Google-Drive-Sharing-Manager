import { DriveFile } from "../classes/DriveFile";
import { DriveFolder } from "../classes/DriveFolder";
import { DriveRoot } from "../classes/DriveRoot";
import { Permission, googleDrivePermissionToOurs } from "../classes/Permission";
import { User } from "../classes/User";
import { Group } from "../classes/Group";
import { auth_client } from "../controllers/auth_controller";

const google = require('googleapis').google 
const drive = google.drive('v3');
const GoogleFile = require('googleapis').File


export async function getAllGoogleDriveFiles(): Promise<typeof GoogleFile[]> {
    let nextPageToken: string = ""
    let allFiles: typeof GoogleFile[] = []
    while (nextPageToken != null) {
        let response = await drive.files.list({
            auth: auth_client,
            pageSize: 100,
            pageToken: nextPageToken,
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            fields: 'nextPageToken, files(name, id, mimeType, createdTime, modifiedTime, permissions, parents, owners, sharingUser)',
        })
        allFiles = allFiles.concat(response.data.files)
        nextPageToken = response.data.nextPageToken
    }
    // console.log(JSON.stringify(allFiles, null, "\t"))
    return allFiles
}

export async function getSharedGoogleDrives(): Promise<any> {
    let nextPageToken: string = ""
    let sharedDrives: any = []
    while (nextPageToken != null) {
        let response = await drive.drives.list({
            auth: auth_client,
            pageSize: 100,
            pageToken: nextPageToken,
            fields: 'nextPageToken, drives',
        })
        sharedDrives = sharedDrives.concat(response.data.drives)
        nextPageToken = response.data.nextPageToken
    }
    return sharedDrives
}

export async function buildGoogleDriveTrees(allFiles: any, sharedDrives: any): Promise<DriveRoot[]> {
    let roots: DriveRoot[] = []
    let my_drive_rootID = (await drive.files.get({ auth: auth_client, fileId: "root" })).data.id
    roots.push(new DriveRoot("NEEDS TO BE CHANGED", my_drive_rootID, "My Drive", [], false))
    let shared_with_me_root = new DriveRoot("NEEDS TO BE CHANGED", "shared_with_me", "Shared with me", [], false)
    roots.push(shared_with_me_root)
    sharedDrives.forEach((s: any) => {roots.push(new DriveRoot("NEEDS TO BE CHANGED", s.id, s.name, [], true))});
    
    let idToDriveFiles: Map<string, [DriveFile, string | null]> = new Map<string, [DriveFile, string | null]>()
    roots.forEach((d: DriveRoot) => {idToDriveFiles.set(d.id, [d, null])})

    allFiles.forEach((file: any) => { // construct nodes
        if (!file) 
            throw new Error("file undefined")
        let mimeType: string = file.mimeType
        let parentID : string = (file.parents ? file.parents[0] : "shared_with_me") 
        let owner = file.owners ? new User(file.owners[0].emailAddress, file.owners[0].displayName) : null
        let shared_by: User | Group | null = (file.sharingUser ? new User(file.sharingUser.emailAddress, file.sharingUser.displayName) : null)           
        let permissions: Permission[] = file.permissions ? file.permissions.map((p: any) => {
            let granted_to: User | Group = new User(p.emailAddress, file.owners[0].displayName)
            return new Permission("NEEDS TO BE CHANGED", p.id, granted_to, googleDrivePermissionToOurs[p.role])
        }) : []
        if (mimeType === "application/vnd.google-apps.folder") {
            idToDriveFiles.set(file.id, [new DriveFolder("NEEDS TO BE CHANGED", file.id, null, file.createdTime, file.modifiedTime, file.name, owner, permissions, shared_by, mimeType, []), parentID])
        }
        else {
            idToDriveFiles.set(file.id, [new DriveFile("NEEDS TO BE CHANGED", file.id, null, file.createdTime, file.modifiedTime, file.name, owner, permissions, shared_by, mimeType), parentID])
        }
    })

    idToDriveFiles.forEach(([child, parentID]: [DriveFile, string | null], key: string) => { // iterate through nodes and add an edge between node and its parent
        if (!parentID) // means we are at a root (whose parent is set to null); don't process
            return
        if (!idToDriveFiles.has(parentID)) {
            // console.log("WARNING: " + parentID + " not found in files, putting item in shared folders")
            child.parent = shared_with_me_root
        }
        else {
            child.parent = (idToDriveFiles.get(parentID) as [DriveFolder, string])[0]
            child.parent.children.push(child)
        }
    })

    return roots
}