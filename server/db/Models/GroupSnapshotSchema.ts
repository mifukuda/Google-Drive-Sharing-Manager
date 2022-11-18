import { Schema, model } from "mongoose"

export const GroupSnapshotSchema = new Schema(
    {
        name: { type: String, required: true },
        members: [String],
    },
    {
        timestamps: true
    }
)

export const groupSnapshotModel =  model("GroupSnapshots ", GroupSnapshotSchema)