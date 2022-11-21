import { Types } from "mongoose"
import { DriveFile, DriveFolder } from "."
import Models from "../../db/Models"
import { User } from "../UserClasses/User"

export class DriveRoot extends DriveFolder {
    constructor (
        _id: string,
        driveId: string, 
        drive_name: string, 
        children: DriveFile[], 
        public is_shared_drive: boolean
    ) {
        super(_id, driveId, null, new Date(), new Date(), drive_name, null, [], null, "", children)
    }

    getModel(): Object[] {
        //get the children models
        let fileArr = this.children.flatMap(child => child.getModel())

        //make the model for this folder
        let file: any = new Models.FileModel(
            {
                drive_id: this.driveId,
                name: this.name,
                sharedBy: this.shared_by?.getModel(),
                mime_type: this.mime_type,
                type: "ROOT",
                isSharedDrive: true,
                permissions: this.permissions.map(p => p.getModel()),
                children: this.children.map((f: any) => f ? (f._id as Types.ObjectId) : null)
            }
        )

        file._id = this._id
        fileArr.push(file)
        return fileArr 
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