import { DriveFolder } from "."
import { User, Group } from "../UserClasses"
import { Permission } from "../Structures"
import Models from "../../db/Models"

export class DriveFile {
    constructor (
        public _id: string,
        public driveId: string, 
        public parent: DriveFolder | null,
        public date_created: Date,
        public date_modified: Date,
        public name: string,
        public owner: Group | User | null,
        public permissions: Permission[],
        public shared_by: Group | User | null,
        public mime_type: string
    ) {}

    getSubtree(): DriveFile[] {
        return [this]
    }

    getModel(): Object[] {
        return [new Models.FileModel(
            {
                drive_id: this.driveId,
                name: this.name,
                owner: this.owner,
                sharedBy: this.shared_by,
                mime_type: this.mime_type,
                type: "FILE",
                permissions: this.permissions.map(p => p.getModel()),
                children: []
            }
        )]
    }

    serialize(): DriveFile {
        let saved_parent: DriveFolder | null = this.parent
        this.parent = null
        let copy: DriveFile = structuredClone(this)
        this.parent = saved_parent
        return copy
    }

    toString(depth: number): string {
        let parent = (this.parent ? this.parent.driveId : "null")
        return "\t".repeat(depth) + "Type: " + this.constructor.name + ", Name: " + this.name + ", Parent = " + parent + ", Owner: " + (this.owner ? this.owner.display_name : "no owner") + ", date_created = " + this.date_created.toString() + "\n"
    }
}