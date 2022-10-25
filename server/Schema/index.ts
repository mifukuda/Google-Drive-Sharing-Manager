import { Schema, Types, model } from "mongoose";

export const accessControlPolicySchema = new Schema<AccessControlPolicy>({
    AllowedReaders: [{ }]
    AllowedWriters: Group[],
    DeniedReaders: Group[],
    DeniedWriters: Group[],
})

const DriveFileSchema: Schema = new Schema<DriveFolder>({
    id: Types.ObjectId,
    parent: { type: String, required: true },
    date_created: { type: Date, required: true },
    date_modified: { type: Date, required: true },
    name: { type: String, required: true },
    owner: { type:},
    permissions: { Types.DocumentArray, required: true },
    shared_by: {},
    mime_type: {},
})

export const DriveFileModel = model("DriveFile", DriveFileSchema)

export const DriveFolderModel = DriveFileModel.discriminator("DriveFolder", new Schema<DriveFolder>({
    children: { type: Types.DocumentArray<>, required: true }
}, { discriminatorKey: 'kind' })


export const DriveRootModel = DriveFolderModel.discriminator("DriveRoot", new Schema<DriveRoot>({
    is_shared_drive: Boolean
}, { discriminatorKey: 'kind' }))

const FileInfoSnapshotSchema = new Schema<FileInfoSnapshot>({
    date_created: { type: Date, required: true},
    drive_roots: { type: Types.DocumentArray<Types.ObjectId>, ref:  required: true}
})

export const groupSchema = new Schema<User>({
    email: String,
    display_name: String
})

export const GroupModel = model("Group", groupSchema)

const permissionSchema = new Schema<Permission>({
    id: Types.ObjectId, 
    granted_to: {Types.ObjectId, ref: UserModel, required: true},
    role: { type: Number, required: true }
})

const querySchema: Schema = new Schema<Query>({
    date_queried: { type: Date, required: true },
    operator: { type: String },
    argument: { type: String }
})

export const QueryModel = model("Query", querySchema)

export const userSchema = new Schema<User>({
    email: String,
    display_name: String
})

export const UserModel = model("User", userSchema)

export const userProfileSchema = new Schema<UserProfile>({
    userID: { type: String, required: true },
    query_history: [{type: Schema.Types.ObjectId, ref: QueryModel}]
})

export const UserProfileModel = model("UserProfile", userProfileSchema)