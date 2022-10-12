const {auth_client} = require('./controllers/auth_controller.js')
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

class DriveFile {
    id: String
    parent: DriveFolder
    date_created: Date
    date_modified: Date
    direct_permissions: Map<Group, permission_level>
    inherited_permissions: Map<Group, permission_level>
    name: String
    constructor(id: String, parent: DriveFolder, date_created: Date, date_modified: Date, direct_permissions: Map<Group, permission_level>, inherited_permissions: Map<Group, permission_level>, name: String) {
        this.id = id
        this.parent = parent
        this.date_created = date_created
        this.date_modified = date_modified
        this.direct_permissions = direct_permissions
        this.inherited_permissions = inherited_permissions
        this.name = name
    }
}

class DriveFolder extends DriveFile {
    children: DriveFile[]
    constructor(id: String, parent: DriveFolder, date_created: Date, date_modified: Date, direct_permissions: Map<Group, permission_level>, inherited_permissions: Map<Group, permission_level>, name: String, children: DriveFile[]) {
        super(id, parent, date_created, date_modified, direct_permissions, inherited_permissions, name)
        this.children = children
    }
}

interface DriveAdapter {
    createFileInfoSnapshot(access_token: string): Promise<void>
    updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void>
}

class SnapshotSystem {
    createFileSharingSnapshot(): void {
        
    }
    createGroupSharingSnapshot(): void {
        // 
    }
}

export class GoogleDriveAdapter implements DriveAdapter {
    async createFileInfoSnapshot(access_token: string): Promise<void> {
        auth_client.setCredentials(access_token)
        const drive = google.drive('v3');
        let nextPageToken: string = ""
        let allFiles: typeof GoogleFile[] = []
        while (nextPageToken != null) {
            let response = await drive.files.list({
                auth: auth_client,
                pageSize: 1,
                pageToken: nextPageToken,
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                fields: 'nextPageToken, files(name, id, mimeType, createdTime, modifiedTime, permissions, parents)',
            })
            allFiles = allFiles.concat(response.data.files)
            nextPageToken = response.data.nextPageToken
        }
        console.log("All files = " + JSON.stringify(allFiles, null, "\t"))
        // let visited = new Map<string, DriveFile>()
        // for (let i = 0; i < allFiles.length; i++) {
        //     let file = allFiles[i]
        //     if (!visited_ids.has(file.id)) {

        //     }
        // }
    }

    async updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void> {
    }
}

// class OneDriveAdapter implements DriveAdapter {

// }