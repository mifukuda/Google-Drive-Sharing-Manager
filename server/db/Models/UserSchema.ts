import { Schema, Types, model } from "mongoose"
import { ACPSchema } from "./ACPSchema"

export const UserSchema = new Schema(
    {
        driveId: {type: String, required: true},
        driveToken: {type: String, required: true},
        driveType: {type: String, required: true},
        displayName: {type: String, required: true},
        email: {type: String, required: true},
        fileSnapshots: [{type: Types.ObjectId, ref: 'fileSnapshotSchema'}],
        groupSnapshots: [{type: Types.ObjectId, ref: 'groupSnapshotSchema'}],
        AccessControlPolicy: [ACPSchema]
    },
    {
        timestamps: true
    }
)

export const userModel = model("Users", UserSchema)