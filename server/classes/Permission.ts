import { Group } from "./Group"
import { Schema, Types } from "mongoose"
import { UserModel } from "./User"


export enum permission_level {
    VIEWER,
    COMMENTER,
    EDITOR,
    OWNER,
}

export const googleDrivePermissionToOurs: { [property: string]: permission_level } = {
    "owner": permission_level.OWNER,
    "writer": permission_level.EDITOR,
    "commenter": permission_level.COMMENTER,
    "reader": permission_level.VIEWER
    // "organizer"
    // "fileOrganizer"
}

export class Permission {
    constructor (
        public id: string, 
        public granted_to: Group, 
        public role: permission_level
    ) {}

    toString(): string {
        return "unimplemented"
    }
}

const permissionSchema = new Schema<Permission>({
    id: Types.ObjectId, 
    granted_to: {Types.ObjectId, ref: UserModel, required: true},
    role: { type: Number, required: true }
})