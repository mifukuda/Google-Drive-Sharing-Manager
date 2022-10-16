const GoogleFile = require('googleapis').File
import { getAllGoogleDriveFiles, treeFromGoogleDriveFiles } from "./google_api_utils"
import { DrivePermissionLevelProperty } from "./predicates"

enum permission_level {
    VIEWER,
    COMMENTER,
    EDITOR,
    OWNER,
}

export const permissionPropertyToLevel: { [property: DrivePermissionLevelProperty]: permission_level } = {
    "readable": permission_level.VIEWER,
    "writable": permission_level.EDITOR,
    "sharable": permission_level.EDITOR
}

export class Permission {
    id: string
    role: permission_level
    to: Group | User
    from: Group | User
    constructor(id: string, to: Group | User, from: Group | User, role: permission_level) {
        this.id = id
        this.to = to
        this.from = from
        this.role = role
    }
}

export class FileInfoSnapshot {
    date_created: Date
    drive_root: DriveRoot
    group_membership_snapshots: GroupMembershipSnapshot[]
    constructor(date_created: Date, drive_root: DriveRoot, group_membership_snapshots: GroupMembershipSnapshot[]) {
        this.date_created = date_created
        this.drive_root = drive_root
        this.group_membership_snapshots = group_membership_snapshots
    }
    
    serialize(): string { // TODO: use structuredClone to seralize instead of JSON.stringify: https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
        return JSON.stringify(this.drive_root.serialize(), null, "\t")
    }

    toString(): string {
        return this.drive_root.toString(0)
    }
}

type DriveParent = DriveFolder | null

export class DriveFile {
    id: string
    parent: DriveParent
    owners: User[]
    creator: User
    permissions: Permission[]
    date_created: Date
    date_modified: Date
    name: string
    constructor(id: string, parent: DriveParent, date_created: Date, date_modified: Date, name: string, owners: User[]) {
        this.id = id
        this.parent = parent
        this.date_created = date_created
        this.date_modified = date_modified
        this.name = name
        this.owners = owners
        this.creator = this.owners[0]
    }

    serialize(): DriveFile {
        let saved_parent: DriveParent = this.parent
        this.parent = null
        let copy: DriveFile = JSON.parse(JSON.stringify(this))
        this.parent = saved_parent
        return copy
    }

    toString(depth: number): string {
        let parent = (this.parent ? this.parent.id : "null")
        return "\t".repeat(depth) + "Type: " + this.constructor.name + ", Name: " + this.name + ", Parent = " + parent + "\n"
    }
}

export class DriveFolder extends DriveFile {
    children: DriveFile[]
    constructor(id: string, parent: DriveParent, date_created: Date, date_modified: Date, name: string, children: DriveFile[]) {
        super(id, parent, date_created, date_modified, name)
        this.children = children
    }

    serialize(): DriveFile {
        let save_parent: DriveParent = this.parent
        this.parent = null
        let save_children = this.children
        let children: DriveFile[] = []
        for (let i = 0; i < this.children.length; i++) {
            let child: DriveFile = this.children[i]
            children.push(child.serialize())
        }
        this.children = children
        let copy: DriveFile = JSON.parse(JSON.stringify(this))
        this.children = save_children
        this.parent = save_parent
        return copy
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

export class DriveRoot extends DriveFolder {
    isSharedDrive: boolean
    constructor(id: string, drive_name: string, children: DriveFile[], isSharedDrive: boolean) {
        super(id, null, new Date(), new Date(), drive_name, children)
        this.isSharedDrive = isSharedDrive
    }

}

interface DriveAdapter {
    createFileInfoSnapshot(access_token: string): Promise<FileInfoSnapshot>
    updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void>
}

export class GoogleDriveAdapter implements DriveAdapter {
    async createFileInfoSnapshot(access_token: string): Promise<FileInfoSnapshot> {
        let allFiles: typeof GoogleFile[] = await getAllGoogleDriveFiles(access_token)
        console.log(JSON.stringify(allFiles, null, "\t"))
        let root: DriveRoot = await treeFromGoogleDriveFiles(allFiles)
        return new FileInfoSnapshot(new Date(), root, [])
    }

    async updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void> {
    }
}

class GroupMembershipSnapshot {
    date_created: Date
    groups: Map<Group, User[]>
    constructor(date_created: Date, groups: Map<Group, User[]>) {
        this.date_created = date_created
        this.groups = groups
    }
}

class Group {
    email: string
    display_name: string
    users: User[]
    constructor(email: string, display_name: string, users: User[]) {
        this.email = email
        this.display_name = display_name
        this.users = users
    }
}

class User {
    email: string
    display_name: string
    constructor(email: string, display_name: string) {
        this.email = email
        this.display_name = display_name
    }
}

export function dummyTreeTest(): DriveRoot {
    let root: DriveRoot = new DriveRoot("r1", "dummydriveroot", [], false)
    let child1: DriveFolder = new DriveFolder("c1", root, new Date(), new Date(), "child1", [])
    let child2: DriveFolder = new DriveFolder("c2", root, new Date(), new Date(), "child2", [])
    let grandchild1: DriveFile = new DriveFile("gc1", child1, new Date(), new Date(), "grandchild1")
    let grandchild2: DriveFile = new DriveFile("gc2", child1, new Date(), new Date(), "grandchild2")
    let grandchild3: DriveFile = new DriveFile("gc3", child2, new Date(), new Date(), "grandchild3")
    let grandchild4: DriveFile = new DriveFile("gc4", child2, new Date(), new Date(), "grandchild4")
    root.children.push(child1)
    root.children.push(child2)
    child1.children.push(grandchild1)
    child1.children.push(grandchild2)
    child2.children.push(grandchild3)
    child2.children.push(grandchild4)
    return root
}