import { DriveRoot } from "../FilesClasses"


export abstract class DriveAdapter {
    driveToken: string
    constructor(driveToken: string){
        this.driveToken = driveToken
    }
    abstract getFileRoots(): Promise<DriveRoot[]>
}
