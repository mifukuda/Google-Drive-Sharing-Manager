import { Schema, Types, model } from "mongoose"

export const UserSchema = new Schema(
    {
        drive_id: { type: String, required: true },
        display_name: {type: String, required: true},
        fileSnapshots: [{type: Schema.Types.ObjectId, ref: 'fileSnapshotSchema'}],
        groupSnapshots: [{type: Schema.Types.ObjectId, ref: 'groupSnapshotSchema'}]
    },
    {
        timestamps: true
    }
)

export const userModel = model("Users", UserSchema)