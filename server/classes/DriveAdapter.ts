import { DriveFile } from "./DriveFile"
import { DriveRoot } from "./DriveRoot"
import { Group } from "./Group"
import { FileInfoSnapshot } from "./FileInfoSnapshot"
import { getAllGoogleDriveFiles, getSharedGoogleDrives, buildGoogleDriveTrees } from "../api_utils/google_api_utils"
const CONFIG = require('../configs.js')
// const google = require('googleapis').google 
import { google } from 'googleapis'


abstract class DriveAdapter {
    driveToken: string
    constructor(driveToken: string){
        this.driveToken = driveToken
    }
    // abstract createUserProfile(): Promise<Object>
    abstract createFileInfoSnapshot(): Promise<FileInfoSnapshot>
    abstract updateSharing(files: DriveFile[], permissions: Group[]): Promise<void>
}

class GoogleDriveAdapter extends DriveAdapter {
    auth_client: typeof(new google.auth.OAuth2)
    
    constructor(driveToken: string){
        super(driveToken)
        // const OAuth2 = google.auth.OAuth2
        // this.auth_client = new OAuth2(
        //     CONFIG.oauth_credentials.client_id, 
        //     CONFIG.oauth_credentials.client_secret, 
        //     CONFIG.oauth_credentials.redirect_uris[0]
        // );
        // this.auth_client.setCredentials(this.driveToken)
    }

    // async createUserProfile(): Promise<Object> {
    //     const userProfile = this.auth_client.currentUser.get().getBasicProfile()
    //     return userProfile
    // }

    async createFileInfoSnapshot(): Promise<FileInfoSnapshot> {
        let allFiles: any = await getAllGoogleDriveFiles()
        let sharedDrives: any = await getSharedGoogleDrives()
        let roots: DriveRoot[] = await buildGoogleDriveTrees(allFiles, sharedDrives)
        return new FileInfoSnapshot("Prak's right nut", new Date(), roots, new Date())
    }

    async updateSharing(files: DriveFile[], permissions: Group[]): Promise<void> {
    }
}

// export {DriveAdapter}
export {GoogleDriveAdapter}