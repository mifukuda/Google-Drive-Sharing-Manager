const GoogleFile = require('googleapis').File
import { getAllGoogleDriveFiles, buildGoogleDriveTrees, getSharedGoogleDrives } from "./google_api_utils"
import { QueryPredicate, isNamedAs, isOwnedBy, isCreatedBy, isSharedBy, isSharedTo, isInDrive, isReadableBy, isSharableBy, isWritableBy, isInFolder, isUnderFolder, hasPath, operatorToQueryPredicate } from "./predicates"

export enum permission_level {
    VIEWER,
    COMMENTER,
    EDITOR,
    OWNER,
}

export const googleDrivePermissionToOurs: { [property: string]: permission_level } = {
    "owner": permission_level.OWNER,
    "writer": permission_level.EDITOR,
    "commenter": permission_level.COMMENTER,
    "reader": permission_level.VIEWER
    // "organizer"
    // "fileOrganizer"
}

export class Permission {
    id: string
    role: permission_level
    granted_to: Group | User
    constructor(id: string, granted_to: Group | User, role: permission_level) {
        this.id = id
        this.granted_to = granted_to
        this.role = role
    }

    toString(): string {
        return "unimplemented"
    }
}

export class Query {
    operator: string
    argument: string
    constructor(property: string, value: string) {
        this.operator = property
        this.argument = value
    }
}

export class FileInfoSnapshot {
    date_created: Date
    drive_roots: DriveRoot[]
    group_membership_snapshots: GroupMembershipSnapshot[]
    constructor(date_created: Date, drive_roots: DriveRoot[], group_membership_snapshots: GroupMembershipSnapshot[]) {
        this.date_created = date_created
        this.drive_roots = drive_roots
        this.group_membership_snapshots = group_membership_snapshots
    }

    applyQuery(query: Query): DriveFile[] {
        let f: QueryPredicate = operatorToQueryPredicate[query.operator]
        return this.drive_roots.reduce((prev: DriveFile[], curr: DriveRoot) => {
            return prev.concat(curr.applyQuery(query, f))
        }, [])
    }
    
    serialize(): FileInfoSnapshot { // TODO: use structuredClone to seralize instead of JSON.stringify: https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
        let save_drive_roots = this.drive_roots
        this.drive_roots = this.drive_roots.map((d: DriveRoot) => {return d.serialize()})
        let copy: FileInfoSnapshot = JSON.parse(JSON.stringify(this))
        this.drive_roots = save_drive_roots
        return copy
    }

    toString(): string {
        let depth: number = 0
        let s = "\t".repeat(depth) + "Type: " + this.constructor.name + "\n"
        for (let i = 0; i < this.drive_roots.length; i++) {
            let child: DriveFile = this.drive_roots[i]
            s = s + child.toString(depth+1) 
        }
        return s
    }
}

type DriveParent = DriveFolder | null

export class DriveFile {
    id: string
    parent: DriveParent
    owner: User | null
    creator: User | null
    shared_by: User | Group | null
    permissions: Permission[]
    date_created: Date
    date_modified: Date
    name: string
    mimeType: string
    constructor(id: string, parent: DriveParent, date_created: Date, date_modified: Date, name: string, owner: User | null, permissions: Permission[], shared_by: User | Group | null, mimeType: string) {
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
        let saved_parent: DriveParent = this.parent
        this.parent = null
        let copy: DriveFile = JSON.parse(JSON.stringify(this))
        this.parent = saved_parent
        return copy
    }

    applyQuery(query: Query, predicate: QueryPredicate): DriveFile[] {
        return (predicate(query.argument, this) ? [this] : [])
    }

    toString(depth: number): string {
        let parent = (this.parent ? this.parent.id : "null")
        return "\t".repeat(depth) + "Type: " + this.constructor.name + ", Name: " + this.name + ", Parent = " + parent + ", Owner: " + (this.owner ? this.owner.display_name : "no owner") + ", date_created = " + this.date_created.toString() + "\n"
    }
}

export class DriveFolder extends DriveFile {
    children: DriveFile[]
    constructor(id: string, parent: DriveParent, date_created: Date, date_modified: Date, name: string, owner: User | Group | null, permissions: Permission[], children: DriveFile[], shared_by: User | Group | null, mimeType: string) {
        super(id, parent, date_created, date_modified, name, owner, permissions, shared_by, mimeType)
        this.children = children
    }

    serialize(): DriveFolder {
        let save_parent: DriveParent = this.parent
        let save_children: DriveFile[] = this.children
        this.parent = null
        this.children = this.children.map(child => child.serialize()) 
        let copy: DriveFolder = JSON.parse(JSON.stringify(this))
        this.children = save_children
        this.parent = save_parent
        return copy
    }

    applyQuery(query: Query, predicate: QueryPredicate): DriveFile[] {
        return this.children.reduce((prev: DriveFile[], child: DriveFile) => {
           return prev.concat(child.applyQuery(query, predicate))  
        }, (predicate(query.argument, this) ? [this] : []))

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
    is_shared_drive: boolean
    constructor(id: string, drive_name: string, children: DriveFile[], isSharedDrive: boolean) {
        super(id, null, new Date(), new Date(), drive_name, new User("", ""), [], children, null, "")
        this.is_shared_drive = isSharedDrive
    }

    serialize(): DriveRoot {
        let save_children = this.children
        this.children = this.children.map(child => child.serialize()) 
        let copy: DriveRoot = JSON.parse(JSON.stringify(this))
        this.children = save_children
        return copy
    }


    applyQuery(query: Query, predicate: QueryPredicate): DriveFile[] {
        return this.children.reduce((prev: DriveFile[], child: DriveFile) => {
           return prev.concat(child.applyQuery(query, predicate))  
        }, [])
    }
}

interface DriveAdapter {
    createFileInfoSnapshot(access_token: string): Promise<FileInfoSnapshot>
    updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void>
}

export class GoogleDriveAdapter implements DriveAdapter {
    async createFileInfoSnapshot(access_token: string): Promise<FileInfoSnapshot> {
        let allFiles: any = await getAllGoogleDriveFiles(access_token)
        let sharedDrives: any = await getSharedGoogleDrives()
        let roots: DriveRoot[] = await buildGoogleDriveTrees(allFiles, sharedDrives)
        return new FileInfoSnapshot(new Date(), roots, [])
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

export class Group {
    email: string
    display_name: string
    users: User[]
    constructor(email: string, display_name: string, users: User[]) {
        this.email = email
        this.display_name = display_name
        this.users = users
    }
}

export class User {
    email: string
    display_name: string
    constructor(email: string, display_name: string) {
        this.email = email
        this.display_name = display_name
    }
}

export function dummyTreeTest(): DriveRoot {
    let root: DriveRoot = new DriveRoot("r1", "dummydriveroot", [], false)
    let user: User = new User("dummyhead", "test@noob.com")
    let child1: DriveFolder = new DriveFolder("c1", root, new Date(), new Date(), "child1", user, [], [], null, "pdf")
    let child2: DriveFolder = new DriveFolder("c2", root, new Date(), new Date(), "child2", user, [], [], null, "pdf")
    let grandchild1: DriveFile = new DriveFile("gc1", child1, new Date(), new Date(), "grandchild1", user, [], null, "pdf")
    let grandchild2: DriveFile = new DriveFile("gc2", child1, new Date(), new Date(), "grandchild2", user, [], null, "pdf")
    let grandchild3: DriveFile = new DriveFile("gc3", child2, new Date(), new Date(), "grandchild3", user, [], null, "pdf")
    let grandchild4: DriveFile = new DriveFile("gc4", child2, new Date(), new Date(), "grandchild4", user, [], null, "pdf")
    root.children.push(child1)
    root.children.push(child2)
    child1.children.push(grandchild1)
    child1.children.push(grandchild2)
    child2.children.push(grandchild3)
    child2.children.push(grandchild4)
    return root
}