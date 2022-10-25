import { DriveFile } from "./DriveFile"
import { DriveFolder } from "./DriveFolder"
import { User } from "./User"
import { Schema, Types } from "mongoose"
import { DriveFolderModel } from "./DriveFolder"

export class DriveRoot extends DriveFolder {
    constructor (
        id: string, 
        drive_name: string, 
        children: DriveFile[], 
        public is_shared_drive: boolean
    ) {
        super(id, null, new Date(), new Date(), drive_name, new User("", ""), [], null, "", children)
    }

    getSubtree(): DriveFile[] {
        return this.children.flatMap((c: DriveFile) => c.getSubtree())
    }

    serialize(): DriveRoot {
        let save_children = this.children
        this.children = this.children.map(child => child.serialize()) 
        let copy: DriveRoot = structuredClone(this)
        this.children = save_children
        return copy
    }
}

export const DriveRootModel = DriveFolderModel.discriminator("DriveRoot", new Schema<DriveRoot>({
    is_shared_drive: Boolean
}, { discriminatorKey: 'kind' }))