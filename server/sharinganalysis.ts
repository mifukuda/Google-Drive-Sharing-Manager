import { DriveFile } from "./classes/DriveFile"
import { DriveFolder } from "./classes/DriveFolder"
import { Permission } from "./classes/Permission"

export const deviantSharing  = (selection: DriveFile[], threshold: number = .80) => {
    let fileIdToFile: Map<string, DriveFile> = new Map<string, DriveFile>()
    selection.forEach((file: DriveFile) => fileIdToFile[file.id] = file)
    let deviantlyShared : DriveFile[] = []
    selection.forEach((folder: DriveFile) =>{
        if(folder instanceof DriveFolder){
            let permissionsToFileId: Map<string, string[]> = new Map<string, string[]>() // 
            let numFiles = 0
            folder.children.forEach((file) => {
                let key: string = JSON.stringify(file.permissions.sort())
                permissionsToFileId.has(key)? permissionsToFileId[key].push(file.id): permissionsToFileId[key] = [file.id]
                numFiles++
            })
            let largestEntry = [...permissionsToFileId.values()].reduce((x, y) => x.length > y.length? x: y)
            if(largestEntry.length / numFiles >= threshold){
                largestEntry.forEach((entry: string) => {
                    deviantlyShared.push(fileIdToFile[entry])
                })
            }
        }
        
    })
    return deviantlyShared
}

export const calculateSharingChanges = (selection1: DriveFolder[], selection2: DriveFolder[]) => {
    let idToPermissions : Map<string, [Permission[], Permission[]]> = new Map<string, [Permission[], Permission[]]>()
    
    selection2.forEach((file: DriveFile) => idToPermissions[file.id] = [file.permissions.sort(), []])
    selection1.forEach((file: DriveFile) => {
        if(idToPermissions.has(file.id)){
            JSON.stringify(file.permissions.sort()) === JSON.stringify(idToPermissions[file.id])
            ? idToPermissions.delete(file.id)
            : idToPermissions[file.id] = [idToPermissions[file.id][0], file.permissions.sort()]
        }
    })
    return idToPermissions
}

export const calculatePermissionDiffences = (selection: DriveFolder[]) => {
    let differentlyShared : Set<DriveFile> = new Set<DriveFile>()

    // input will be flatmap of all files, so selection needs to be filtered for only folders
    selection.forEach((folder: DriveFolder) => {
        // let parentPermissions =  folder.permissions.map((permssion: Permission) => JSON.stringify(permssion)).sort()
        if(folder instanceof DriveFolder){
            let parentPermissions = JSON.stringify(folder.permissions.sort())
            folder.children.forEach((child : DriveFile) => {
                // let childPermissions =  child.permissions.map((permssion: Permission) => JSON.stringify(permssion)).sort()
                let childPermissions = JSON.stringify(child.permissions.sort())
                if(JSON.stringify(childPermissions) !== JSON.stringify(parentPermissions)){
                    differentlyShared.add(child)
                }
            })
        }
    })

    return differentlyShared
}