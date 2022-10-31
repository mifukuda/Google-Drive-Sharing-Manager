import { Schema, Types, model } from "mongoose"
import { ACPSchema } from "./ACPSchema"

export const UserSchema = new Schema(
    {
        drive_id: { type: String, required: true },
        driveToken: {type: String, required: true},
        driveType: {type: String, required: true},
        display_name: {type: String, required: true},
        fileSnapshots: [{type: Schema.Types.ObjectId, ref: 'fileSnapshotSchema'}],
        groupSnapshots: [{type: Schema.Types.ObjectId, ref: 'groupSnapshotSchema'}],
        AccessControlPolicy: {type: ACPSchema} 
    },
    {
        timestamps: true
    }
)

export const userModel = model("Users", UserSchema)