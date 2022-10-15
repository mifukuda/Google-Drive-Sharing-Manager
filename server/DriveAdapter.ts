const {auth_client} = require('./controllers/auth_controller.ts')
const google = require('googleapis').google 
const GoogleFile = require('googleapis').File

enum permission_level {
    OWNER,
    VIEWER,
    EDITOR,
    COMMENTER,
}

class FileInfoSnapshot {
    date_created: Date
    root_directory: DriveFolder
    group_membership_snapshots: GroupMembershipSnapshot[]
    constructor(date_created: Date, root_directory: DriveFolder, group_membership_snapshots: GroupMembershipSnapshot[]) {
        this.date_created = date_created
        this.root_directory = root_directory
        this.group_membership_snapshots = group_membership_snapshots
    }

    toString(): String {
        return this.root_directory.toString(0)
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

type DriveParent = DriveFolder | null

class DriveFile {
    id: String
    parent: DriveParent
    date_created: Date
    date_modified: Date
    // direct_permissions: Map<Group, permission_level>
    // inherited_permissions: Map<Group, permission_level>
    name: String
    constructor(id: String, parent: DriveParent, date_created: Date, date_modified: Date, name: String) {
        this.id = id
        this.parent = parent
        this.date_created = date_created
        this.date_modified = date_modified
        // this.direct_permissions = direct_permissions
        // this.inherited_permissions = inherited_permissions
        this.name = name
    }

    toString(depth: number): String {
        return "\t".repeat(depth) + this.name + ", type: DriveFile\n"
    }
}

class DriveFolder extends DriveFile {
    children: DriveFile[]
    constructor(id: String, parent: DriveParent, date_created: Date, date_modified: Date, name: String, children: DriveFile[]) {
        super(id, parent, date_created, date_modified, name)
        this.children = children
    }

    toString(depth: number): String {
        let s = "\t".repeat(depth) + this.name + ", type: DriveFolder" + "\n"
        for (let i = 0; i < this.children.length; i++) {
            let child: DriveFile = this.children[i]
            s = s + child.toString(depth+1) 
        }
        return s
    }
}

interface DriveAdapter {
    createFileInfoSnapshot(access_token: string): Promise<FileInfoSnapshot>
    updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void>
}

class SnapshotSystem {
    createFileSharingSnapshot(): void {
    }
    createGroupSharingSnapshot(): void {
    }
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
        // console.log(JSON.stringify(allFiles, null, "\t"))
        // todo: set DriveFolder children default value to empty list to avoid conditional logic
        // create DriveRoot as a subclass of DriveFolder
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

        let root: DriveFolder = new DriveFolder("", null, new Date(), new Date(), "Drive Root", [])
        for (let [id, fileAndParentId] of idToDriveFiles) {
            let child: DriveFile = fileAndParentId[0]
            let parentID: String = fileAndParentId[1]
            if (!(idToDriveFiles.has(parentID))) {
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

// class OneDriveAdapter implements DriveAdapter {

// }

export function dummyTreeTest(): DriveFolder {
    let root: DriveFolder = new DriveFolder("", null, new Date(), new Date(), "Root", [])
    let child1: DriveFolder = new DriveFolder("", root, new Date(), new Date(), "child1", [])
    let child2: DriveFolder = new DriveFolder("", root, new Date(), new Date(), "child2", [])
    let grandchild1: DriveFile = new DriveFile("", child1, new Date(), new Date(), "grandchild1")
    let grandchild2: DriveFile = new DriveFile("", child1, new Date(), new Date(), "grandchild2")
    let grandchild3: DriveFile = new DriveFile("", child2, new Date(), new Date(), "grandchild3")
    let grandchild4: DriveFile = new DriveFile("", child2, new Date(), new Date(), "grandchild4")
    root.children.push(child1)
    root.children.push(child2)
    child1.children.push(grandchild1)
    child1.children.push(grandchild2)
    child2.children.push(grandchild3)
    child2.children.push(grandchild4)
    return root
}