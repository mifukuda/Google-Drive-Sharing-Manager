import { DriveFile } from "./DriveFile"
import { DriveRoot } from "./DriveRoot"
import { Group } from "./Group"
import { FileInfoSnapshot } from "./FileInfoSnapshot"
import { getAllGoogleDriveFiles, getSharedGoogleDrives, buildGoogleDriveTrees } from "../api_utils/google_api_utils"


interface DriveAdapter {
    createFileInfoSnapshot(access_token: string): Promise<FileInfoSnapshot>
    updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void>
}

export class GoogleDriveAdapter implements DriveAdapter {
    async createFileInfoSnapshot(): Promise<FileInfoSnapshot> {
        let allFiles: any = await getAllGoogleDriveFiles()
        let sharedDrives: any = await getSharedGoogleDrives()
        let roots: DriveRoot[] = await buildGoogleDriveTrees(allFiles, sharedDrives)
        return new FileInfoSnapshot(new Date(), roots, [])
    }

    async updateSharing(access_token: string, files: DriveFile[], permissions: Group[]): Promise<void> {
    }
}