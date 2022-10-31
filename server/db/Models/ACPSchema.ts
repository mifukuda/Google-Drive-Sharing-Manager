import { Schema, Types, model } from "mongoose"
import { driveUserSchema } from "./DriveUserSchema"

export const ACPSchema = new Schema(
    {
        allowedReaders: [driveUserSchema],
        deniedReaders: [driveUserSchema],
        allowedWriters: [driveUserSchema],
        deniedWriters: [driveUserSchema]
    },
    {
        timestamps: true
    }
)

export const ACPModel =  model("ACP ", ACPSchema)