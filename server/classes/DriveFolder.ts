import { DriveFile } from "./DriveFile"
import { User } from "./User"
import { Group } from "./Group"
import { Permission } from "./Permission"

export class DriveFolder extends DriveFile {
    children: DriveFile[]
    constructor(id: string, parent: DriveFolder | null, date_created: Date, date_modified: Date, name: string, owner: User | Group | null, permissions: Permission[], children: DriveFile[], shared_by: User | Group | null, mimeType: string) {
        super(id, parent, date_created, date_modified, name, owner, permissions, shared_by, mimeType)
        this.children = children
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

    getSubtree(): DriveFile[] {
        return this.children.flatMap((c: DriveFile) => c.getSubtree()).concat([this])
    }

    toString(depth: number): string {
        let parent = (this.parent ? this.parent.id : "null")
        let s = "\t".repeat(depth) + "Type: " + this.constructor.name + ", Name: " + this.name + ", Parent = " + parent + "\n"
        for (let i = 0; i < this.children.length; i++) {
            let child: DriveFile = this.children[i]
            s = s + child.toString(depth+1) 
        }
        return s
    }
}