import { Schema, Types, model } from "mongoose"

export const PermissionSchema = new Schema(
    {
        drive_id: { type: String, required: true },
        grantedTo: {type: String},
        role: {type: Number, required: true}
    }
)

export const permissionModel = model("Permission", PermissionSchema)