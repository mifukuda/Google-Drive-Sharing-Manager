import { DriveFile, DriveFolder, DriveRoot } from "../FilesClasses";
import {onedrivePermissionToOurs, Permission} from "../Structures";
import { DriveAdapter } from "./DriveAdapter";
import axios from 'axios'
import { Types } from "mongoose";
import { User } from "../UserClasses/User";
const CONFIG = require('../../configs.js')

// async function getAPI(request: string, accessToken: string){
    
//     const axiosIns = axios.create({
//         baseURL: 'https://graph.microsoft.com/v1.0',
//         headers: {
//             Authorization: accessToken
//         }
//     })

//     //get all the drives
//     let { data } = await axiosIns.get(request, { responseType: 'arraybuffer'})
//     const output = zlib.gunzip(data, function (_err, output) {
//         return output.toString()
//       })
//     return output
// }

export class MSDriveAdapter extends DriveAdapter{

    constructor(driveToken: string){
        super(driveToken)
    }

    async getFileRoots(): Promise<any>{
        //get access token
        const accessToken = await this.getAccessToken()

        //set the axios config
        const axiosIns = axios.create({
            baseURL: 'https://graph.microsoft.com/v1.0',
            headers: {
                Authorization: accessToken,
                "Accept-Encoding": "identity"
                // responseType: 'arraybuffer',
                // decompress: true
            }
        })

        //get all the drives
        let { data } = await axiosIns.get('/me/drives')
        let roots: DriveRoot[] = await Promise.all(data.value.map(async(drive:any) => {
            let resp: any = await axiosIns.get(`/me/drives/${drive.id}/root`)
            resp = resp.data
            return new DriveRoot(new Types.ObjectId().toString(), resp.id, resp.name, [], resp.parentReference.driveType !== 'personal')
        }))
        
        //populate the drive items
        async function populateItems(file: DriveFolder): Promise<void>{
            //get the children
            const { data } = await axiosIns.get(`/me/drive/items/${file.driveId}/children`)
            async function getPermissions(id: String): Promise<Permission[]>{
                let respData: any = await axiosIns.get(`/me/drive/items/${id}/permissions`)
                respData = respData.data.value
                return respData.map((permission: any) => {
                    return new Permission(
                        new Types.ObjectId().toString(),
                        permission.id,
                        new User("MICROSOFT", permission.grantedTo.user.id, permission.grantedTo.user.displayName),
                        onedrivePermissionToOurs[permission.roles[0]]
                    )
                })
            }

            //recursive call on each children
            for(let i = 0; i < data.value.length; i++){
                 //get the user data for createdBy
                 const user: any = await axiosIns.get(`/users/${data.value[i].createdBy.user.id}`)

                if(data.value[i].file == undefined){
                    //create a new folder
                    const folder = data.value[i]
                    
                    const driveFolder = new DriveFolder(
                        new Types.ObjectId().toString(), 
                        folder.id, 
                        null, 
                        folder.createdDateTime, 
                        folder.lastModifiedDateTime, 
                        folder.name,
                        new User("MICROSOFT", user.data.userPrincipalName, folder.createdBy.user.displayName),
                        [],
                        null,
                        "Folder",
                        []
                    )
                    file.children.push(driveFolder)

                    //get the permissions for this folder
                    driveFolder.permissions = await getPermissions(folder.id)

                    //recursively call
                    await populateItems(driveFolder)

                }else{
                    //create a new file
                    const newFile = data.value[i]
                    const driveFile = new DriveFile(
                        new Types.ObjectId().toString(),
                        newFile.id,
                        null,
                        newFile.createdDateTime,
                        newFile.lastModifiedDateTime,
                        newFile.name,
                        new User("MICROSOFT", user.data.userPrincipalName, newFile.createdBy.user.displayName),
                        [],
                        null,
                        newFile.file.mimeType
                    )
                    file.children.push(driveFile)

                    //get the permissions for the file
                    driveFile.permissions = await getPermissions(newFile.id)
                }
            }
        }
        for (let i = 0; i < roots.length; i++) {
            await populateItems(roots[i])
        }
        return roots
    }

    async getAccessToken(): Promise<any>{
        // testing a request
        const axiosIns = axios.create({
            baseURL: "https://login.microsoftonline.com/common/oauth2/v2.0"
        })
        const newTokens:any = await axiosIns.post('/token', new URLSearchParams({
            client_id: CONFIG.onedrive_credentials.client_id,
            redirect_uri: CONFIG.onedrive_credentials.redirect_uri,
            client_secret: CONFIG.onedrive_credentials.client_secret,
            refresh_token: this.driveToken,
            grant_type: "refresh_token"
        }))

        return newTokens.data.access_token
    }
    // async buildGoogleDriveTrees(allFiles: any, sharedDrives: any): Promise<DriveRoot[]>{
        
    // }
}