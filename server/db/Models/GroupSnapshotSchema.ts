import { Schema, model } from "mongoose"

export const GroupSnapshotSchema = new Schema(
    {
        email: { type: String, required: true },
        name: { type: String, required: true },
        members: [String],
        timestamp: { type: Date, required: true }
    },
    {
        timestamps: true
    }
)

export const groupSnapshotModel =  model("GroupSnapshots", GroupSnapshotSchema)