import path from "path";
import { DriveFile, DriveFolder, Permission, permission_level, Query } from "./DriveAdapter";

export type QueryPredicate = (value: string, operand: DriveFile) => boolean

export const isInDrive: QueryPredicate = (value: string, operand: DriveFile) => { // drive:drive | files in drive drive. drive is “MyDrive” or a shared drive’s name
    let curr: DriveFile = operand
    while (curr.parent != null) {
        curr = curr.parent
    }
    return curr.name === value
} 

export const isNamedAs: QueryPredicate = (value: string, operand: DriveFile) => { // name:regexp | files whose name matches regexp
    return new RegExp(value).test(operand.name)
} 

export const isOwnedBy: QueryPredicate = (value: string, operand: DriveFile) => { // owner:user | files owned by user  
    return value === operand.owner.email
} 

export const isCreatedBy: QueryPredicate = (value: string, operand: DriveFile) => {  // creator:user | files created by user (equiv. to “owner” for services without ownership transfer)
    return value === operand.creator.email
} 

export const isSharedBy: QueryPredicate = (value: string, operand: DriveFile) => {  // from:user | files shared by user
    return (operand.shared_by != null ? value === operand.shared_by.email : false)
} 

export const isSharedTo: QueryPredicate = (value: string, operand: DriveFile) => { // to:user | files directly (i.e., ignoring inherited and group permissions) shared with user
    return operand.permissions.some((p: Permission) => p.granted_to.email === value)
} 

export const isReadableBy: QueryPredicate = (value: string, operand: DriveFile) => {  // readable:user | files readable (viewable) by user
    return operand.permissions.some((p: Permission) => p.granted_to.email === value && p.role >= permission_level.VIEWER)
} 

export const isWritableBy: QueryPredicate = (value: string, operand: DriveFile) => {  // writable:user | files writable (editable) by user
    return operand.permissions.some((p: Permission) => p.granted_to.email === value && p.role >= permission_level.EDITOR)
} 

export const isSharableBy: QueryPredicate = (value: string, operand: DriveFile) => {  // sharable:user | files sharable by user, i.e., user can change the file’s permissions
    return operand.permissions.some((p: Permission) => p.granted_to.email === value && p.role >= permission_level.EDITOR)
} 

export const isInFolder: QueryPredicate = (value: string, operand: DriveFile) => {  // inFolder:regexp | files in all folders whose name matches regexp
    return (operand.parent != null ? new RegExp(value).test(operand.parent.name) : false)
} 

export const isUnderFolder: QueryPredicate = (value: string, operand: DriveFile) => {  // folder:regexp | files under all folders whose name matches regexp
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

export const hasPath: QueryPredicate = (value: string, operand: DriveFile) => { // path:path | files under the folder with path path; use “/” as separator
    let curr_file: DriveFile = operand
    let curr_path: string = ""
    while (curr_file.parent != null) {
        curr_path = curr_file.name + "/" + curr_path
        curr_file = curr_file.parent
    }
    return curr_path === value
} 


// sharing:none | unshared files
// sharing:anyone | files shared with anyone with the link
// sharing:individual | files shared with specific users
// sharing:domain | files shared with anyone in the owner’s domain (e.g., stonybrook.edu)