import { Schema, Types, model } from 'mongoose'
import { PermissionSchema } from "./PermissionSchema"

export const FileSchema = new Schema(
    {
        drive_id: { type: String, required: true },
        name: { type: String, required: true },
        owner: { type: String},
        sharedBy: { type: String},
        mime_type: { type: String},
        type: {type: String, required: true},
        isSharedDrive: {type: Boolean},
        permissions: [PermissionSchema],
        children: [{ type: Schema.Types.ObjectId}]
    }
)

export const fileModel = model("Files", FileSchema)