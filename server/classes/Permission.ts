import { Group } from "./Group"
import { User } from "./User"


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
        public granted_to: Group | User, 
        public role: permission_level
    ) {}

    toString(): string {
        return "unimplemented"
    }
}
