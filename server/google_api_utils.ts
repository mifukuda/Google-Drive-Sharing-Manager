import { DriveRoot, DriveFile, DriveFolder, Permission, User, Group, googleDrivePermissionToOurs } from "./DriveAdapter";

const {auth_client} = require('./controllers/auth_controller.ts')
const google = require('googleapis').google 
const drive = google.drive('v3');
const GoogleFile = require('googleapis').File

export async function getAllGoogleDriveFiles(access_token: string, drive_id: string = ""): Promise<typeof GoogleFile[]> {
    auth_client.setCredentials(access_token)
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

export async function treeFromGoogleDriveFiles(allFiles: any): Promise<DriveRoot> {
    let idToDriveFiles: Map<string, [DriveFile, string]> = new Map<string, [DriveFile, string]>()
    for (let i = 0; i < allFiles.length; i++) {
        let file = allFiles[i]
        if (file === undefined) {
            throw new Error("file undefined")
        }
        let parentID : string = (file.parents ? file.parents[0] : "") 
        let mimeType: string = file.mimeType
        let owner = file.owners ? new User(file.owners[0].emailAddress, file.owners[0].displayName) : null
        let shared_by: User | Group | null = (file.sharingUser ? new User(file.sharingUser.emailAddress, file.sharingUser.displayName) : null)           
        let permissions: Permission[] = file.permissions ? file.permissions.map((p: any)  => {
            let to: User | Group = new User(p.emailAddress, file.owners[0].displayName)
            return new Permission(p.id, to, googleDrivePermissionToOurs[p.role])
        }) : []
        if (file.mimeType === "application/vnd.google-apps.folder") {
            idToDriveFiles.set(file.id, [new DriveFolder(file.id, null, file.createdTime, file.modifiedTime, file.name, owner, permissions, [], shared_by, mimeType), parentID])
        }
        else {
            idToDriveFiles.set(file.id, [new DriveFile(file.id, null, file.createdTime, file.modifiedTime, file.name, owner, permissions, shared_by, mimeType), parentID])
        }
    }

    let root: DriveRoot = new DriveRoot("", "My Drive", [], false) 
    for (let [id, fileAndParentId] of idToDriveFiles) {
        let child: DriveFile = fileAndParentId[0]
        let parentID: string = fileAndParentId[1]
        if (!(idToDriveFiles.has(parentID))) {
            root.id = parentID
            child.parent = root
            root.children.push(child)
        }
        else {
            let parent: DriveFolder = (idToDriveFiles.get(parentID) as [DriveFile, string])[0] as DriveFolder
            child.parent = parent
            parent.children.push(child)
        }
    }
    return root
}