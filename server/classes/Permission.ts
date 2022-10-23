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
    id: string
    role: permission_level
    granted_to: Group | User
    constructor(id: string, granted_to: Group | User, role: permission_level) {
        this.id = id
        this.granted_to = granted_to
        this.role = role
    }

    toString(): string {
        return "unimplemented"
    }
}
