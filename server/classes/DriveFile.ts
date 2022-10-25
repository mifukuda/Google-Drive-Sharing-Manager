import { DriveFolder } from "./DriveFolder"
import { User } from "./User"
import { Group } from "./Group"
import { Permission } from "./Permission"
import { model, Schema, Types, Model } from "mongoose"

export class DriveFile {
    constructor (
        public id: string,
        public parent: DriveFolder | null,
        public date_created: Date,
        public date_modified: Date,
        public name: string,
        public owner: Group | null,
        public permissions: Permission[],
        public shared_by: Group | null,
        public mime_type: string
    ) {}

    getSubtree(): DriveFile[] {
        return [this]
    }

    saveToDb(): void {
        let document = new DriveFileModel(this.properties)
        document.saveToDb()
    }

    getFromDb(): void {
        
    }

    serialize(): DriveFile {
        let saved_parent: DriveFolder | null = this.parent
        this.parent = null
        let copy: DriveFile = structuredClone(this)
        this.parent = saved_parent
        return copy
    }

    toString(depth: number): string {
        let parent = (this.parent ? this.parent.id : "null")
        return "\t".repeat(depth) + "Type: " + this.constructor.name + ", Name: " + this.name + ", Parent = " + parent + ", Owner: " + (this.owner ? this.owner.display_name : "no owner") + ", date_created = " + this.date_created.toString() + "\n"
    }
}


const DriveFileSchema: Schema = new Schema<DriveFolder>({
    id: Types.ObjectId,
    parent: { type: String, required: true },
    date_created: { type: Date, required: true },
    date_modified: { type: Date, required: true },
    name: { type: String, required: true },
    owner: { type:},
    permissions: { Types.DocumentArray, required: true },
    shared_by: {},
    mime_type: {},
})

export const DriveFileModel = model("DriveFile", DriveFileSchema)
