import { OAuth2Client } from "google-auth-library"
import { google } from 'googleapis'
import { DriveAdapter } from "."
import { DriveFile, DriveFolder, DriveRoot } from "../FilesClasses"
import { googleDrivePermissionToOurs, Permission } from "../Structures"
import { Group, User } from "../UserClasses"
import { Types } from 'mongoose'
const CONFIG = require('../../configs.js')


export class GoogleDriveAdapter extends DriveAdapter {
    auth_client: OAuth2Client
    
    constructor(driveToken: string){
        super(driveToken)
        const OAuth2 = google.auth.OAuth2
        this.auth_client = new OAuth2(
            CONFIG.oauth_credentials.client_id, 
            CONFIG.oauth_credentials.client_secret, 
            CONFIG.oauth_credentials.redirect_uris[0]
        );
        this.auth_client.setCredentials({ refresh_token: this.driveToken })
    }

    async getUserInfo(): Promise<any>{
        //get the user profile information
        const oauth2 = google.oauth2({
            auth: this.auth_client,
            version: 'v2'
        });

        let userInfo:any
        try{
            userInfo = (await oauth2.userinfo.get()).data
        }catch(err){
            console.log("Error getting the user info: ", err)
        }

        return userInfo
    }
    
    async getFileRoots(): Promise<DriveRoot[]> {
        let allFiles: any = await this.getAllGoogleDriveFiles()
        await this.populateSharedDrivePermissions(allFiles)
        let sharedDrives: any = await this.getSharedGoogleDrives()
        let roots: DriveRoot[] = await this.buildGoogleDriveTrees(allFiles, sharedDrives)
        return roots
    }

    async getAllGoogleDriveFiles(): Promise<any>{
        const drive = google.drive('v3');
        const GoogleFile = require('googleapis').File
        let nextPageToken: any = ""
        let allFiles: typeof GoogleFile[] = []
        while (nextPageToken != null) {
            let response = await drive.files.list({
                auth: this.auth_client,
                pageSize: 100,
                pageToken: nextPageToken,
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                corpora: 'allDrives',
                fields: 'nextPageToken, files(name, id, mimeType, createdTime, modifiedTime, permissions, parents, owners, sharingUser, driveId)',
            })
            allFiles = allFiles.concat(response.data.files)
            nextPageToken = response.data.nextPageToken
        }
        // console.log(JSON.stringify(allFiles, null, "\t"))
        return allFiles
    }

    async getSharedGoogleDrives(): Promise<any>{
        const drive = google.drive('v3');
        const GoogleFile = require('googleapis').File

        let nextPageToken: any = ""
        let sharedDrives: any = []
        while (nextPageToken != null) {
            let response = await drive.drives.list({
                auth: this.auth_client,
                pageSize: 100,
                pageToken: nextPageToken,
                fields: 'nextPageToken, drives',
            })
            sharedDrives = sharedDrives.concat(response.data.drives)
            nextPageToken = response.data.nextPageToken
        }
        return sharedDrives
    }

    async populateSharedDrivePermissions(allfiles: any[]): Promise<any> {
        const drive = google.drive('v3');
        for (let i = 0; i < allfiles.length; i++) {
            let file: any = allfiles[i]
            let allPerms: any[] = []
            let nextPageToken: any = ""
            if (file.driveId) {
                while (nextPageToken != null) {
                    let response = await drive.permissions.list({
                        fileId: file.id,
                        auth: this.auth_client,
                        pageSize: 100,
                        // pageToken: nextPageToken,
                        supportsAllDrives: true,
                        fields: 'permissions(emailAddress, displayName, role, id)'
                    })
                    // console.log("response.data: ", JSON.stringify(response.data, null, "\t"))
                    allPerms = allPerms.concat(response.data.permissions)
                    nextPageToken = response.data.nextPageToken
                }
                file.permissions = allPerms;
            }
            //file.permissions = allPerms
        }
    }

    async buildGoogleDriveTrees(allFiles: any, sharedDrives: any): Promise<DriveRoot[]> {
        const drive = google.drive('v3');
        const GoogleFile = require('googleapis').File
        let roots: DriveRoot[] = []
        let my_drive_rootID:any = (await drive.files.get({ auth: this.auth_client, fileId: "root" })).data.id
        roots.push(new DriveRoot(new Types.ObjectId().toString(), my_drive_rootID, "My Drive", [], false))
        let shared_with_me_root = new DriveRoot(new Types.ObjectId().toString(), "shared_with_me", "Shared with me", [], false)
        roots.push(shared_with_me_root)
        sharedDrives.forEach((s: any) => {roots.push(new DriveRoot(new Types.ObjectId().toString(), s.id, s.name, [], true))});
        
        let idToDriveFiles: Map<string, [DriveFile, string | null]> = new Map<string, [DriveFile, string | null]>()
        roots.forEach((d: DriveRoot) => {idToDriveFiles.set(d.driveId, [d, null])})
    
        allFiles.forEach((file: any) => { // construct nodes
            if (!file) 
                throw new Error("file undefined")
            let mimeType: string = file.mimeType
            let parentID : string = (file.parents ? file.parents[0] : "shared_with_me") 
            let owner_kind = file.owners ? (file.owners[0].kind === "drive#user" ? "user" : "group"): ""
            let owner = file.owners ? new User(owner_kind, file.owners[0].emailAddress, file.owners[0].displayName) : null
            let shared_by_kind = file.sharingUser ? (file.sharingUser.kind === "drive#user" ? "user" : "group"): ""
            let shared_by: User | null = (file.sharingUser ? new User(shared_by_kind, file.sharingUser.emailAddress, file.sharingUser.displayName) : null)           
            let permissions: Permission[] = file.permissions ? file.permissions.map((p: any) => {
                if (p.type === "domain") p.emailAddress = p.domain
                let granted_to: User = new User(p.type, p.emailAddress, p.displayName)
                return new Permission(new Types.ObjectId().toString(), p.id, granted_to, googleDrivePermissionToOurs[p.role])
            }) : []
            if (mimeType === "application/vnd.google-apps.folder") {
                idToDriveFiles.set(file.id, [new DriveFolder(new Types.ObjectId().toString(), file.id, null, file.createdTime, file.modifiedTime, file.name, owner, permissions, shared_by, mimeType, [], ""), parentID])
            }
            else {
                idToDriveFiles.set(file.id, [new DriveFile(new Types.ObjectId().toString(), file.id, null, file.createdTime, file.modifiedTime, file.name, owner, permissions, shared_by, mimeType, ""), parentID])
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
    
        // set paths of each node
        function setPath(f: DriveFile){
            let path = f.parent?.path
            if(path === undefined){ //root
                path = ""
            }
            else{
                path += f.name
            }

            f.path = path as string

            f = f as DriveFolder
            if(f instanceof DriveFolder){
                f.path += "/"
                for(let i = 0; i < f.children.length; i++){
                    setPath(f.children[i])
                }
            }
        }
        for(let i = 0; i < roots.length; i++){
            setPath(roots[i])
        }

        return roots
    }

    async deletePermission(fileDriveID: string, permissionDriveID: string) {
        const drive = google.drive('v3');
        console.log("fileDriveId: ", fileDriveID)
        let response = await drive.permissions.delete({
            auth: this.auth_client,
            fileId: fileDriveID,
            permissionId: permissionDriveID
        })
        if (!response) throw new Error("Response undefined")
    }

    async addPermission(fileDriveID: string, email: string, role: string): Promise<any> {
        const drive = google.drive('v3');
        console.log("fileDriveId: ", fileDriveID)
        let response = await drive.permissions.create({
            auth: this.auth_client,
            fileId: fileDriveID,
            fields: 'emailAddress, displayName, id, role',
            requestBody: {
                type: "user",
                emailAddress: email,
                role: role
            }
        })
        console.log("add readers response.data = ", response.data)
        if (!response) throw new Error("Response undefined")
        return response
    }
}