import { DriveFile } from "./classes/DriveFile"
import { DriveFolder } from "./classes/DriveFolder"
import { Permission } from "./classes/Permission"

export const deviantSharing  = (selection: DriveFile[], threshold: number = .80) => {
    let fileIdToFile: Map<string, DriveFile> = new Map<string, DriveFile>()
    selection.forEach((file: DriveFile) => fileIdToFile.set(file.id, file))
    // let deviantlyShared : DriveFile[] = []
    // let deviantlyShared : Map<DriveFile, DriveFile[]> = new Map<DriveFile, DriveFile[]>
    let deviantlyShared : Map<string, string[]> = new Map<string, string[]>
    selection.forEach((folder: DriveFile) =>{

        if(folder instanceof DriveFolder){
            let permissionsToFileId: Map<string, string[]> = new Map<string, string[]>() // 
            let numFiles = 0
            folder.children.forEach((file) => {
                let key: string = JSON.stringify(file.permissions.sort())
                if (key === undefined || key === JSON.stringify([])){
                    key = "NO PERMISSION"
                }
                permissionsToFileId.has(key)? permissionsToFileId.set(key, (permissionsToFileId.get(key) as string[]).concat([file.id])): permissionsToFileId.set(key, [file.id])
                numFiles++
            })
            if(numFiles > 0){
                let largestEntry = [...permissionsToFileId.values()].reduce((x, y) => x.length > y.length? x: y)
                // let commonFile: DriveFile = fileIdToFile.get(largestEntry[0]) as any
                let commonFile = JSON.parse(JSON.stringify((fileIdToFile.get(largestEntry[0]) as any).permissions, null, '\t'))
                if(largestEntry.length / numFiles >= threshold){
                    // deviantlyShared.set(commonFile, [])
                    permissionsToFileId.forEach((value, key) => {
                        if(JSON.stringify(value) !== JSON.stringify(largestEntry)){
                            value.forEach((fileId) => {
                                // deviantlyShared.push(fileIdToFile.get(fileId) as DriveFile)
                                // deviantlyShared.has(commonFile)
                                //     ? deviantlyShared.set(commonFile, (deviantlyShared.get(commonFile) as any).concat([fileIdToFile.get(fileId)]))
                                //     : deviantlyShared.set(commonFile, [fileIdToFile.get(fileId) as any])

                                // deviantlyShared.set(commonFile, (deviantlyShared.get(commonFile) as any).concat([fileIdToFile.get(fileId)]))

                                // deviantlyShared.has(commonFile)
                                // ? deviantlyShared.set(commonFile, (deviantlyShared.get(commonFile) as any).concat([(fileIdToFile.get(fileId) as any).serialize()]))
                                // : deviantlyShared.set(commonFile, [(fileIdToFile.get(fileId) as any).serialize()])

                                let curr = (fileIdToFile.get(fileId) as any)
                                curr.source = folder.name
                                console.log("brah ",curr)

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
    
    selection2.forEach((file: DriveFile) => idToPermissions.set(file.id, [file.permissions.sort(), []]))
    selection1.forEach((file: DriveFile) => {
        if(idToPermissions.has(file.id)){
            JSON.stringify(file.permissions.sort()) === JSON.stringify(idToPermissions.get(file.id))
            ? idToPermissions.delete(file.id)
            : idToPermissions.set(file.id, [(idToPermissions.get(file.id) as [Permission[], Permission[]])[0], file.permissions.sort()])        
        }
    })
    return idToPermissions
}

export const calculatePermissionDiffences = (selection: DriveFile[]) => {
    let differentlyShared : Set<DriveFile> = new Set<DriveFile>()
    let result : Map<string, string[]> = new Map<string, string[]>

    selection.forEach((folder: DriveFile) => {
        if(folder instanceof DriveFolder && folder.children.length > 0){
            let parentPermissions = JSON.stringify(folder.permissions.sort())
            folder.children.forEach((child : DriveFile) => {
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