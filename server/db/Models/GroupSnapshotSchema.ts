import { Schema, Types, model } from "mongoose"
import { driveUserSchema } from "./DriveUserSchema"

export const GroupSnapshotSchema = new Schema(
    {
        user_id: {type: Types.ObjectId, ref:'userSchema'},
        name: { type: String, required: true},
        members: [driveUserSchema],
    },
    {
        timestamps: true
    }
)

export const groupSnapshotModel =  model("GroupSnapshots ", GroupSnapshotSchema)