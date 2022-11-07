import { Types } from "mongoose"
import Models from "../../db/Models"
import { Group, User } from "../UserClasses"


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
        public _id: string,
        public driveId: string, 
        public granted_to: Group | User, 
        public role: permission_level
    ) {}

    getModel(): Object {
        return new Models.PermissionModel({
            _id: new Types.ObjectId(this._id),
            drive_id: this.driveId,
            grantedTo: this.granted_to,
            role: this.role
        })
    }

    toString(): string {
        return "unimplemented"
    }
}
