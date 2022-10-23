import { DriveFile } from "./DriveFile"
import { DriveFolder } from "./DriveFolder"
import { User } from "./User"

export class DriveRoot extends DriveFolder {
    is_shared_drive: boolean
    constructor(id: string, drive_name: string, children: DriveFile[], isSharedDrive: boolean) {
        super(id, null, new Date(), new Date(), drive_name, new User("", ""), [], children, null, "")
        this.is_shared_drive = isSharedDrive
    }

    serialize(): DriveRoot {
        let save_children = this.children
        this.children = this.children.map(child => child.serialize()) 
        let copy: DriveRoot = structuredClone(this)
        this.children = save_children
        return copy
    }

    getSubtree(): DriveFile[] {
        return this.children.flatMap((c: DriveFile) => c.getSubtree())
    }
}