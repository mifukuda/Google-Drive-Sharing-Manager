import { Schema, Types, model } from 'mongoose'
import { driveUserSchema } from './DriveUserSchema'
import { PermissionSchema } from './PermissionSchema'

export const FileSchema = new Schema(
    {
        drive_id: { type: String, required: true },
        name: { type: String, required: true },
        path: {type: String},
        owner: driveUserSchema,
        sharedBy: driveUserSchema,
        mime_type: { type: String},
        type: {type: String, required: true},
        isSharedDrive: {type: Boolean},
        permissions: [PermissionSchema],
        children: [{ type: Schema.Types.ObjectId}]
    }
)

export const fileModel = model("Files", FileSchema)