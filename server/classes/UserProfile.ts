import { Query, QueryModel } from "./Query";
import { AccessControlPolicy } from "./AccessControlPolicy";
import { Schema, Types, model } from "mongoose";
import { FileInfoSnapshot } from "./FileInfoSnapshot";

export class UserProfile {
    constructor (
        public userID: string,
        public query_history: Query[],
        // public logs: Log[],
        public access_control_policies: AccessControlPolicy[],
        public snapshots: FileInfoSnapshot[]
    ) {}

}

export const userProfileSchema = new Schema<UserProfile>({
    userID: { type: String, required: true },
    query_history: [{type: Schema.Types.ObjectId, ref: QueryModel}]
})

export const UserProfileModel = model("UserProfile", userProfileSchema)