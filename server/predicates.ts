import { DriveFile, Permission } from "./DriveAdapter";
import { permissionPropertyToLevel } from "./DriveAdapter"

type DriveFileProperty = "drive" | "owner" | "creator" | "from" | "name"
// owner:user | files owned by user
// creator:user | files created by user (equiv. to “owner” for services without ownership transfer)
// name:regexp | files whose name matches regexp
function propertyQuery(property: DriveFileProperty, value: string, operand: DriveFile): boolean {
    return new RegExp(value).test(operand[property])
}

type DriveFilePermissionProperty = "to" | "from"
// to:user | files directly (i.e., ignoring inherited and group permissions) shared with user
// from:user | files shared by user
function permissionQuery(property: DriveFilePermissionProperty, value: string, operand: DriveFile): boolean {
    return operand.permissions.some((p: Permission) => p[property].email === value)
}

export type DrivePermissionLevelProperty = "readable" | "writable" | "sharable"

// readable:user | files readable (viewable) by user
// writable:user | files writable (editable) by user
// sharable:user | files sharable by user, i.e., user can change the file’s permissions
function permissionLevelQuery(property: DriveFilePermissionProperty, value: string, operand: DriveFile) {
    return permissionPropertyToLevel[property]
}

// sharing:none | unshared files
// sharing:anyone | files shared with anyone with the link
// sharing:individual | files shared with specific users
// sharing:domain | files shared with anyone in the owner’s domain (e.g., stonybrook.edu)

// folder:regexp | files under all folders whose name matches regexp
// drive:drive | files in drive drive. drive is “MyDrive” or a shared drive’s name

// path:path | files under the folder with path path; use “/” as separator

// inFolder:regexp | files in all folders whose name matches regexp