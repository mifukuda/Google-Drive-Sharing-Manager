import { Types } from "mongoose";
import Models from "../../db/Models";
import { AccessControlPolicy, FileInfoSnapshot, GroupMembershipSnapshot } from "../Structures";
import { Query } from "./Query";

export class UserProfile {
    constructor (
        public _id: Types.ObjectId,
        public driveId: string,
        public driveToken: string,
        public driveType: string,
        public displayName: string,
        public email: string,
        public query_history: Query[],
        // public logs: Log[],
        public access_control_policies: AccessControlPolicy[],
        public fileSnapshots: FileInfoSnapshot[],
        public groupSnapshots: GroupMembershipSnapshot[]
    ) {}

    static async createUserProfile(driveId: string, driveToken: string, driveType: string, name: string, email: string): Promise<any> {
        let userProfile = new Models.UserModel({
            driveId: driveId,
            driveToken: driveToken,
            driveType: driveType,
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
 
        return new UserProfile(userProfile._id, driveId, userProfile.driveToken, driveType, name, email, [], [], [], [])
    }

    static async getUserProfileByDriveId(driveId: String): Promise<any>{
        let userProfile: any = null
        try{
            userProfile = await Models.UserModel.findOne({driveId: driveId})
        }catch(err){
            console.log("Error querying user profile.", err)
        }
        if(userProfile !== null){
            userProfile = new UserProfile(userProfile._id, userProfile.driveId, userProfile.driveToken, userProfile.driveType,
                             userProfile.displayName, userProfile.email, [], userProfile.access_control_policies, userProfile.fileSnapshots, userProfile.groupSnapshots)
        }
        return userProfile
    }

    static async getUserProfileById(_id: Types.ObjectId): Promise<any>{
        let userProfile: any = null
        try{
            userProfile = await Models.UserModel.findById(_id)
        }catch(err){
            console.log("Error querying user profile.", err)
        }
        if(userProfile !== null){
            userProfile = new UserProfile(userProfile._id, userProfile.driveId, userProfile.driveToken, userProfile.driveType,
                             userProfile.displayName, userProfile.email, [], userProfile.access_control_policies, userProfile.fileSnapshots, userProfile.groupSnapshots)
        }
        return userProfile
    }

}