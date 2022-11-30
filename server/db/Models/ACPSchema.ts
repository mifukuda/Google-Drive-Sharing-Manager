import { Schema, Types, model } from "mongoose"
import { driveUserSchema } from "./DriveUserSchema"

export const ACPSchema = new Schema(
    {
        query: String,
        AR: [String],
        DR: [String],
        AW: [String],
        DW: [String],
        isGroup: {type: Boolean, required: true},
    },
    {
        timestamps: true
    }
)

export const ACPModel =  model("ACP ", ACPSchema)