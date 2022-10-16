import { DriveRoot, DriveFile, DriveFolder } from "./DriveAdapter";

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
            fields: 'nextPageToken, files(name, id, mimeType, createdTime, modifiedTime, permissions, parents)',
        })
        allFiles = allFiles.concat(response.data.files)
        nextPageToken = response.data.nextPageToken
    }
    return allFiles
}

export async function treeFromGoogleDriveFiles(allFiles: typeof GoogleFile[]): Promise<DriveRoot> {
    let idToDriveFiles: Map<string, [DriveFile, string]> = new Map<string, [DriveFile, string]>()
    for (let i = 0; i < allFiles.length; i++) {
        let file: typeof GoogleFile = allFiles[i]
        let parentID : string = (file.parents ? file.parents[0] : "") 
        if (file.mimeType === "application/vnd.google-apps.folder") {
            idToDriveFiles.set(file.id, [new DriveFolder(file.id, null, file.dateCreated, file.dateModified, file.name, []), parentID])
        }
        else {
            idToDriveFiles.set(file.id, [new DriveFile(file.id, null, file.dateCreated, file.dateModified, file.name), parentID])
        }
    }

    let root: DriveRoot = new DriveRoot("", "<name of drive>", [], false) 
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