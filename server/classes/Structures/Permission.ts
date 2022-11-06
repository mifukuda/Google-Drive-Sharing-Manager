import { Group } from "../UserClasses/Group"
import { User } from "../UserClasses/User"
import Models from "../../db/Models"


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
        public dbID: string,
        public id: string, 
        public granted_to: Group | User, 
        public role: permission_level
    ) {}

    getModel(): Object {
        return new Models.PermissionModel({
            drive_id: this.id,
            grantedTo: this.granted_to,
            role: this.role
        })
    }

    toString(): string {
        return "unimplemented"
    }
}
