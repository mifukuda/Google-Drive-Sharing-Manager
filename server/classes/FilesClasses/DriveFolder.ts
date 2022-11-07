import { Types } from "mongoose"
import { DriveFile } from "."
import Models from "../../db/Models"
import { Permission } from "../Structures"
import { Group, User } from "../UserClasses"

export class DriveFolder extends DriveFile {
    constructor (
        _id: string,
        driveId: string, 
        parent: DriveFolder | null, 
        date_created: Date,
        date_modified: Date,
        name: string, 
        owner: Group | User | null, 
        permissions: Permission[], 
        shared_by: Group | User | null, 
        mime_type: string,
        public children: DriveFile[]
    ) {
        super(_id, driveId, parent, date_created, date_modified, name, owner, permissions, shared_by, mime_type)
    }

    getSubtree(): DriveFile[] {
        return this.children.flatMap((c: DriveFile) => c.getSubtree()).concat([this])
    }

    getModel(): Object[] {
        //get the children models
        let fileArr = this.children.flatMap((child: DriveFile) => child.getModel())

        //make the model for this folder
        let file: any = new Models.FileModel(
            {
                drive_id: this.driveId,
                name: this.name,
                owner: this.owner,
                sharedBy: this.shared_by,
                mime_type: this.mime_type,
                type: "FOLDER",
                permissions: this.permissions.map(p => p.getModel()),
                children: fileArr.map((f: any) => f ? f._id : null)
            }
        )

        file._id = this._id
        fileArr.push(file)
        return fileArr 
    }

    serialize(): DriveFolder {
        let save_parent: DriveFolder | null = this.parent
        this.parent = null
        let save_children: DriveFile[] = this.children
        this.children = this.children.map(child => child.serialize()) 
        let copy: DriveFolder = structuredClone(this)
        this.children = save_children
        this.parent = save_parent
        return copy
    }

    toString(depth: number): string {
        let parent = (this.parent ? this.parent.driveId : "null")
        let s = "\t".repeat(depth) + "Type: " + this.constructor.name + ", Name: " + this.name + ", Parent = " + parent + "\n"
        for (let i = 0; i < this.children.length; i++) {
            let child: DriveFile = this.children[i]
            s = s + child.toString(depth+1) 
        }
        return s
    }
}