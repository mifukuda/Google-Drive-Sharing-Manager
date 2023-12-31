import { DriveFile } from "./classes/FilesClasses/"
import { Permission, permission_level } from "./classes/Structures"

export type QueryPredicate = (value: string, operand: DriveFile) => boolean

const isInDrive: QueryPredicate = (value: string, operand: DriveFile) => { // drive:drive | files in drive drive. drive is “MyDrive” or a shared drive’s name
    let curr: DriveFile = operand
    while (curr.parent != null) {
        curr = curr.parent
    }
    return curr.name === value
} 

const isNamedAs: QueryPredicate = (value: string, operand: DriveFile) => { // name:regexp | files whose name matches regexp
    return new RegExp(value).test(operand.name)
} 

const isOwnedBy: QueryPredicate = (value: string, operand: DriveFile) => { // owner:user | files owned by user  
    return operand.owner ? value === operand.owner.email : false           // creator:user | files created by user (equiv. to “owner” for services without ownership transfer)
} 

const isSharedBy: QueryPredicate = (value: string, operand: DriveFile) => {  // from:user | files shared by user
    return (operand.shared_by != null ? value === operand.shared_by.email : false)
} 

const isSharedTo: QueryPredicate = (value: string, operand: DriveFile) => { // to:user | files directly (i.e., ignoring inherited and group permissions) shared with user
    return operand.permissions.some((p: Permission) => p.granted_to.email === value)
} 

const isReadableBy: QueryPredicate = (value: string, operand: DriveFile) => {  // readable:user | files readable (viewable) by user
    return operand.permissions.some((p: Permission) => p.granted_to.email === value && p.role >= permission_level.VIEWER)
} 

const isWritableBy: QueryPredicate = (value: string, operand: DriveFile) => {  // writable:user | files writable (editable) by user
    return operand.permissions.some((p: Permission) => p.granted_to.email === value && p.role >= permission_level.EDITOR)
} 

const isSharableBy: QueryPredicate = (value: string, operand: DriveFile) => {  // sharable:user | files sharable by user, i.e., user can change the file’s permissions
    return operand.permissions.some((p: Permission) => p.granted_to.email === value && p.role >= permission_level.EDITOR)
} 

const isInFolder: QueryPredicate = (value: string, operand: DriveFile) => {  // inFolder:regexp | files in all folders whose name matches regexp
    return (operand.parent != null ? new RegExp(value).test(operand.parent.name) : false)
} 

const isUnderFolder: QueryPredicate = (value: string, operand: DriveFile) => {  // folder:regexp | files under all folders whose name matches regexp
    let curr: DriveFile
    if (operand.parent != null) {
        curr = operand.parent
    }
    else {
        return false
    }
    while (curr.parent != null) {
        if (new RegExp(value).test(curr.name) /*&& curr instanceof DriveRoot*/)
            return true
        curr = curr.parent
    }
    return false
} 

const hasPath: QueryPredicate = (value: string, operand: DriveFile) => { // path:path | files under the folder with path path; use “/” as separator
    let curr_file: DriveFile = operand
    let curr_path: string = ""
    // while (curr_file.parent != null && curr_file.parent.parent != null) {
    //     curr_file = curr_file.parent
    //     curr_path = curr_file.name + "/" + curr_path
    // }
    // // console.log(curr_path)
    // return curr_path === value
    return curr_file.path === value
} 

const isSharedWith: QueryPredicate = (value: string, operand: DriveFile) => {
    switch (value) {
        case "none": return operand.permissions.length != 0 && !operand.permissions.some((p: Permission) => p.granted_to.email !== operand.owner?.email) // sharing:none | unshared files
        case "anyone": return operand.permissions.some((p: Permission) => p.granted_to.type === "anyone") // sharing:anyone | files shared with anyone with the link
        case "individual": return !operand.permissions.some((p: Permission) => p.granted_to.type === "anyone") // sharing:individual | files shared with specific users
        case "domain": return operand.permissions.some((p: Permission) => p.granted_to.type === "domain" && operand.owner?.email.split("@")[1] === p.granted_to.email) // sharing:domain | files shared with anyone in the owner’s domain (e.g., stonybrook.edu)
        default: throw new Error("invalid argument for sharing operator")
    }
} 


export const operatorToQueryPredicate: { [property: string]: QueryPredicate } = {
    "drive": isInDrive,
    "owner": isOwnedBy,
    "creator": isOwnedBy,
    "from": isSharedBy,
    "to": isSharedTo,
    "readable": isReadableBy,
    "writable": isWritableBy,
    "sharable": isSharableBy,
    "name": isNamedAs,
    "inFolder": isInFolder,
    "folder": isUnderFolder,
    "path": hasPath,
    "sharing": isSharedWith
}