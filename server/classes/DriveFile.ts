import { DriveFolder } from "./DriveFolder"
import { User } from "./User"
import { Group } from "./Group"
import { Permission } from "./Permission"

export class DriveFile {
    constructor (
        public id: string,
        public parent: DriveFolder | null,
        public date_created: Date,
        public date_modified: Date,
        public name: string,
        public owner: User | null,
        public permissions: Permission[],
        public shared_by: User | Group | null,
        public mimeType: string
    ) {}

    getSubtree(): DriveFile[] {
        return [this]
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