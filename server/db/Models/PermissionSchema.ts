import { Schema, Types, model } from "mongoose"
import { driveUserSchema } from "./DriveUserSchema"

export const PermissionSchema = new Schema(
    {
        drive_id: { type: String, required: true },
        grantedTo: driveUserSchema,
        role: {type: Number, required: true}
    }
)

export const permissionModel = model("Permission", PermissionSchema)