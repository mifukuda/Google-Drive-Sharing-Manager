import { DriveFile, DriveRoot } from "../FilesClasses"
import { Group } from "../UserClasses"


export abstract class DriveAdapter {
    driveToken: string
    constructor(driveToken: string){
        this.driveToken = driveToken
    }
    abstract getFileRoots(): Promise<DriveRoot[]>
    abstract updateSharing(files: DriveFile[], permissions: Group[]): Promise<void>
}
