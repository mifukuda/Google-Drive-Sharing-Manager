import { DriveFolder } from "./DriveFolder"
import { User } from "./User"
import { Group } from "./Group"
import { Permission } from "./Permission"

export class DriveFile {
    id: string
    parent: DriveFolder | null
    owner: User | null
    creator: User | null
    shared_by: User | Group | null
    permissions: Permission[]
    date_created: Date
    date_modified: Date
    name: string
    mimeType: string
    constructor(id: string, parent: DriveFolder | null, date_created: Date, date_modified: Date, name: string, owner: User | null, permissions: Permission[], shared_by: User | Group | null, mimeType: string) {
        this.id = id
        this.parent = parent
        this.date_created = date_created
        this.date_modified = date_modified
        this.name = name
        this.owner = owner
        this.permissions = permissions
        this.creator = owner
        this.shared_by = shared_by
        this.mimeType = mimeType
    }

    serialize(): DriveFile {
        let saved_parent: DriveFolder | null = this.parent
        this.parent = null
        let copy: DriveFile = structuredClone(this)
        this.parent = saved_parent
        return copy
    }

    getSubtree(): DriveFile[] {
        return [this]
    }

    toString(depth: number): string {
        let parent = (this.parent ? this.parent.id : "null")
        return "\t".repeat(depth) + "Type: " + this.constructor.name + ", Name: " + this.name + ", Parent = " + parent + ", Owner: " + (this.owner ? this.owner.display_name : "no owner") + ", date_created = " + this.date_created.toString() + "\n"
    }
}