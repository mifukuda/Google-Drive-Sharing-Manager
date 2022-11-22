import { DriveFile, DriveFolder } from "./classes/FilesClasses/"
import { Permission } from "./classes/Structures/Permission"

export const analyzeDeviantSharing  = (selection: DriveFile[], threshold: number = .80) => {
    let fileIdToFile: Map<string, DriveFile> = new Map<string, DriveFile>()
    selection.forEach((file: DriveFile) => fileIdToFile.set(file.driveId, file))
    let deviantlyShared : Map<string, string[]> = new Map<string, string[]>
    selection.forEach((folder: DriveFile) =>{

        if(folder instanceof DriveFolder){
            let permissionsToFileId: Map<string, string[]> = new Map<string, string[]>() // 
            let numFiles = 0
            folder.children.forEach((file) => {
                file.permissions.forEach((permission) => {permission._id = "0"})
                let key: string = JSON.stringify(file.permissions.sort())
                if (key === undefined || key === JSON.stringify([])){
                    key = "NO PERMISSION"
                }
                permissionsToFileId.has(key)? permissionsToFileId.set(key, (permissionsToFileId.get(key) as string[]).concat([file.driveId])): permissionsToFileId.set(key, [file.driveId])
                numFiles++
            })
            if(numFiles > 0){
                let largestEntry = [...permissionsToFileId.values()].reduce((x, y) => x.length > y.length? x: y)
                if(largestEntry.length / numFiles >= threshold){
                    let commonFile = JSON.parse(JSON.stringify((fileIdToFile.get(largestEntry[0]) as any).permissions, null, '\t'))
                    permissionsToFileId.forEach((value, key) => {
                        if(JSON.stringify(value) !== JSON.stringify(largestEntry)){
                            value.forEach((fileId) => {
                                let curr = (fileIdToFile.get(fileId) as any)
                                curr.source = folder.name

                                deviantlyShared.has(commonFile)
                                ? deviantlyShared.set(commonFile, (deviantlyShared.get(commonFile) as any).concat([curr.serialize()]))
                                : deviantlyShared.set(commonFile, [curr.serialize()])
                            })
                        }
                    })
                }
            }
        }
        
    })

    return deviantlyShared
}

export const calculateSharingChanges = (selection1: DriveFile[], selection2: DriveFile[]) => {
    let idToPermissions : Map<string, [Permission[], Permission[]]> = new Map<string, [Permission[], Permission[]]>()
    
    selection1.forEach((file: DriveFile) => file.permissions.forEach(permission => {
        permission._id = "0"        
    }))
    selection2.forEach((file: DriveFile) => file.permissions.forEach(permission => {
        permission._id = "0"        
    }))

    selection2.forEach((file: DriveFile) => idToPermissions.set(file.driveId, [file.permissions.sort(), []]))
    selection1.forEach((file: DriveFile) => {
        if(idToPermissions.has(file.driveId)){
            JSON.stringify(file.permissions.sort()) === JSON.stringify((idToPermissions.get(file.driveId) as [Permission[], Permission[]])[0])
            ? idToPermissions.delete(file.driveId)
            : idToPermissions.set(file.driveId, [(idToPermissions.get(file.driveId) as [Permission[], Permission[]])[0], file.permissions.sort()])        
        }
    })
    let fileToPermissions : Map<DriveFile, [Permission[], Permission[]]> = new Map<DriveFile, [Permission[], Permission[]]>()
    selection2.forEach((file: DriveFile) => {
        if(idToPermissions.has(file.driveId)){
            file.parent = null
            fileToPermissions.set(file, (idToPermissions.get(file.driveId) as [Permission[], Permission[]]))
        }
    })
    return fileToPermissions
}

export const calculatePermissionDifferences = (selection: DriveFile[]) => {
    let differentlyShared : Set<DriveFile> = new Set<DriveFile>()
    let result : Map<string, string[]> = new Map<string, string[]>

    selection.forEach((folder: DriveFile) => {
        if(folder instanceof DriveFolder && folder.children.length > 0){
            folder.permissions.forEach((permission) => {permission._id = "0"})
            let parentPermissions = JSON.stringify(folder.permissions.sort())
            folder.children.forEach((child : DriveFile) => {
                child.permissions.forEach((permission) => {permission._id = "0"})
                let childPermissions = JSON.stringify(child.permissions.sort())
                if(JSON.stringify(childPermissions) !== JSON.stringify(parentPermissions)){
                    differentlyShared.add(child)

                    let parent = folder as any
                    parent.children = []
                    result.has(parent.serialize())
                    ? result.set(parent.serialize(), (result.get(parent) as any).concat([(child as any).serialize()]))
                    : result.set(parent.serialize(), [(child as any).serialize()])
                }
            })
        }
    })

    // return [...differentlyShared]
    return result
}