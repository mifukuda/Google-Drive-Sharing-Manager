import { DriveFile } from "./DriveFile"
import { DriveFolder } from "./DriveFolder"
import { User } from "../UserClasses/User"
import Models from "../../db/Models"
import { Types } from "mongoose"

export class DriveRoot extends DriveFolder {
    constructor (
        _id: string,
        id: string, 
        drive_name: string, 
        children: DriveFile[], 
        public is_shared_drive: boolean
    ) {
        super("NEEDS TO BE REPLACED", id, null, new Date(), new Date(), drive_name, new User("", ""), [], null, "", children)
    }

    getModel(): Object[] {
        //get the children models
        let fileArr = this.children.flatMap(child => child.getModel())

        //make the model for this folder
        let file: any = new Models.FileModel(
            {
                drive_id: this.id,
                name: this.name,
                owner: this.owner,
                sharedBy: this.shared_by,
                mime_type: this.mime_type,
                type: "ROOT",
                isSharedDrive: true,
                permissions: this.permissions.map(p => p.getModel()),
                children: fileArr.map((f: any) => f ? f._id : null)
            }
        )

        file._id = new Types.ObjectId()
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