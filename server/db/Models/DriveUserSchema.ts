import { Schema, Types, model } from "mongoose"

export const driveUserSchema = new Schema(
    {
        email: {type: String },
        display_name: {type: String }
    }
)

export const driveUserModel = model('driveUserModel', driveUserSchema)