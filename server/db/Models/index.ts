import { userModel } from "./UserSchema"
import { permissionModel } from "./PermissionSchema"
import { groupSnapshotModel } from "./GroupSnapshotSchema"
import { fileSnapshotModel } from "./FileSnapshotSchema"
import { fileModel } from "./FileSchema"
import { driveUserModel } from "./DriveUserSchema"
import { ACPModel } from "./ACPSchema"

const Models = {
    UserModel: userModel,
    PermissionModel: permissionModel,
    GroupSnapshotModel: groupSnapshotModel,
    FileSnapshotModel: fileSnapshotModel,
    FileModel: fileModel,
    DriveUserModel: driveUserModel,
    ACPModel: ACPModel
}

export default Models

// export const accessControlPolicySchema = new Schema<AccessControlPolicy>({
//     AllowedReaders: [{ }]
//     AllowedWriters: Group[],
//     DeniedReaders: Group[],
//     DeniedWriters: Group[],
// })

// const querySchema: Schema = new Schema<Query>({
//     date_queried: { type: Date, required: true },
//     operator: { type: String },
//     argument: { type: String }
// })

// export const QueryModel = model("Query", querySchema)