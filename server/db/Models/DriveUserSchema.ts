import { Schema, Types, model } from "mongoose"

export const driveUserSchema = new Schema(
    {
        email: {type: String, required: true},
        display_name: {type: String, required: true}
    }
)

export const driveUserModel = model('driveUserModel', driveUserSchema)