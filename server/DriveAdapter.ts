const {auth_client} = require('./controllers/auth_controller.ts')
const google = require('googleapis').google 
const GoogleFile = require('googleapis').File

enum permission_level {
    OWNER,
    VIEWER,
    EDITOR,
    COMMENTER,
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
    
    serialize(): string {
        return JSON.stringify(this.drive_root.serialize(), null, "\t")
    }

    toString(): String {
        return this.drive_root.toString(0)
    }
}

type DriveParent = DriveFolder | null

class DriveFile {
    id: String
    parent: DriveParent
    date_created: Date
    date_modified: Date
    name: String
    constructor(id: String, parent: DriveParent, date_created: Date, date_modified: Date, name: String) {
        this.id = id
        this.parent = parent
        this.date_created = date_created
        this.date_modified = date_modified
        this.name = name
    }

    serialize(): DriveFile {
        let saved_parent: DriveParent = this.parent
        this.parent = null
        let copy: DriveFile = JSON.parse(JSON.stringify(this))
        this.parent = saved_parent
        return copy
    }

    toString(depth: number): String {
        let parent = (this.parent ? this.parent.id : "null")
        return "\t".repeat(depth) + "Type: " + this.constructor.name + ", Name: " + this.name + ", Parent = " + parent + "\n"
    }
}

class DriveFolder extends DriveFile {
    children: DriveFile[]
    constructor(id: String, parent: DriveParent, date_created: Date, date_modified: Date, name: String, children: DriveFile[]) {
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

    toString(depth: number): String {
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
    constructor(id: String, name: String, children: DriveFile[], isSharedDrive: boolean) {
        super(id, null, new Date(), new Date(), name, children)
        this.isSharedDrive = isSharedDrive
    }

}

interface DriveAdapter {
    createFileInfoSnapshot(access_token: string): Promise<FileInfoSnapshot>
    updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void>
}

export class GoogleDriveAdapter implements DriveAdapter {
    async createFileInfoSnapshot(access_token: string): Promise<FileInfoSnapshot> {
        auth_client.setCredentials(access_token)
        const drive = google.drive('v3');
        let nextPageToken: String = ""
        let allFiles: typeof GoogleFile[] = []
        while (nextPageToken != null) {
            let response = await drive.files.list({
                auth: auth_client,
                pageSize: 100,
                pageToken: nextPageToken,
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                fields: 'nextPageToken, files(name, id, mimeType, createdTime, modifiedTime, permissions, parents)',
            })
            allFiles = allFiles.concat(response.data.files)
            nextPageToken = response.data.nextPageToken
        }
        let idToDriveFiles: Map<String, [DriveFile, String]> = new Map<String, [DriveFile, String]>()
        for (let i = 0; i < allFiles.length; i++) {
            let file: typeof GoogleFile = allFiles[i]
            let parentID : String = (file.parents ? file.parents[0] : "") 
            if (file.mimeType === "application/vnd.google-apps.folder") {
                idToDriveFiles.set(file.id, [new DriveFolder(file.id, null, file.dateCreated, file.dateModified, file.name, []), parentID])
            }
            else {
                idToDriveFiles.set(file.id, [new DriveFile(file.id, null, file.dateCreated, file.dateModified, file.name), parentID])
            }
        }

        let root: DriveRoot = new DriveRoot("", "<needs implementation>", [], false) 
        for (let [id, fileAndParentId] of idToDriveFiles) {
            let child: DriveFile = fileAndParentId[0]
            let parentID: String = fileAndParentId[1]
            if (!(idToDriveFiles.has(parentID))) {
                root.id = parentID
                child.parent = root
                root.children.push(child)
            }
            else {
                let parent: DriveFolder = (idToDriveFiles.get(parentID) as [DriveFile, String])[0] as DriveFolder
                child.parent = parent
                parent.children.push(child)
            }
        }
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
    email: String
    display_name: String
    constructor(email: String, display_name: String) {
        this.email = email
        this.display_name = display_name
    }
}

class User extends Group {}

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