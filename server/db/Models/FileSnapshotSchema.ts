import { Schema, Types, model } from 'mongoose'
import { FileSchema } from "./FileSchema"

export const FileSnapshotSchema = new Schema(
    {
        userId: {type: Types.ObjectId, ref:'userSchema'},
        files: [FileSchema]
    },
    {
        timestamps: true
    }
)

export const fileSnapshotModel = model("FileSnapshots", FileSnapshotSchema)