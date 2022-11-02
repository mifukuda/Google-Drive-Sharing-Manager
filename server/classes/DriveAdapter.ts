import { DriveFile } from "./DriveFile"
import { DriveRoot } from "./DriveRoot"
import { Group } from "./Group"
import { FileInfoSnapshot } from "./FileInfoSnapshot"
import { UserProfile } from "./UserProfile"
import { getAllGoogleDriveFiles, getSharedGoogleDrives, buildGoogleDriveTrees } from "../api_utils/google_api_utils"
const CONFIG = require('../configs.js')
import { google } from 'googleapis'
import { OAuth2Client } from "google-auth-library"
import Models from "../db/Models"
import { Types, HydratedDocument } from "mongoose"


export abstract class DriveAdapter {
    driveToken: string
    constructor(driveToken: string){
        this.driveToken = driveToken
    }
    abstract createUserProfile(driveId: String, name: String, email: String): Promise<any>
    abstract createFileInfoSnapshot(userID: Types.ObjectId): Promise<FileInfoSnapshot>
    abstract updateSharing(files: DriveFile[], permissions: Group[]): Promise<void>
}

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

    // async getUserInfo(): Promise<any>{
    //     //get the user profile information
    //     const oauth2 = google.oauth2({
    //         auth: this.auth_client,
    //         version: 'v2'
    //     });

    //     let userInfo:any
    //     try{
    //         userInfo = (await oauth2.userinfo.get()).data
    //     }catch(err){
    //         console.log("Error getting the user info: ", err)
    //     }

    //     return userInfo
    // }

    async createUserProfile(driveId: String, name: String, email: String): Promise<any> {
        let userProfile = new Models.UserModel({
            driveId: driveId,
            driveToken: this.driveToken,
            driveType: "GOOGLE",
            displayName: name,
            email: email, 
            fileSnapshots: [],
            groupSnapshots: [],
            AccessControlPolicy: []
        })

        try{
            userProfile = await userProfile.save()
        }catch(err){
            console.log("Error saving user to the database", err)
        }



        return userProfile
    }

    async getUserProfileByDriveId(driveId: String): Promise<any>{
        let userProfile = null
        try{
            userProfile = await Models.UserModel.findOne({driveId: driveId})
        }catch(err){
            console.log("Error querying user profile.", err)
        }

        return userProfile
    }

    async getUserProfileById(_id: Types.ObjectId): Promise<any>{
        let userProfile = null
        try{
            userProfile = await Models.UserModel.findById(_id)
        }catch(err){
            console.log("Error querying user profile.", err)
        }

        return userProfile
    }

    async createFileInfoSnapshot(userID: Types.ObjectId): Promise<FileInfoSnapshot> {
        let allFiles: any = await getAllGoogleDriveFiles()
        let sharedDrives: any = await getSharedGoogleDrives()
        let roots: DriveRoot[] = await buildGoogleDriveTrees(allFiles, sharedDrives)
        
        // save to the database

        return new FileInfoSnapshot(userID, new Date(), roots, new Date())
    }

    async updateSharing(files: DriveFile[], permissions: Group[]): Promise<void> {

    }

    
}

// export {DriveAdapter}
// export {GoogleDriveAdapter}