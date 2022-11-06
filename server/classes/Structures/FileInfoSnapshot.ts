import { DriveRoot } from "../FilesClasses/DriveRoot"
import { DriveFile } from "../FilesClasses/DriveFile"
import { Query } from "../UserClasses/Query"
import { operatorToQueryPredicate, QueryPredicate } from "../../predicates"
import Models from "../../db/Models"
import { Types } from "mongoose"
import { fileSnapshotModel } from "../db/Models/FileSnapshotSchema"
import { DriveFolder } from "./DriveFolder"
import { Permission } from "./Permission"
import { User } from "./User"

export class FileInfoSnapshot {
    constructor (
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public drive_roots: DriveRoot[], 
        public date_updated: Date,
        public date_created: Date
    ) {}

    static async retrieve(id: Types.ObjectId): Promise<FileInfoSnapshot> {
        let snapshot: any = await fileSnapshotModel.findById(id)
        let roots: DriveRoot[] = []
        let idToDriveFile: Map<string, [DriveFile, Types.ObjectId[]]> = new Map<string, [DriveFile, Types.ObjectId[]]>()
        snapshot.files.forEach((file: any) => {
            let permissions: Permission[] = file.permissions.map((p: any) => new Permission(p._id, p.drive_id, new User("none",  "none"), p.role))
            let drivefile: DriveFile
            switch (file.type) {
                case "ROOT": drivefile = new DriveRoot(file._id, file.drive_id, "", [], false); roots.push(drivefile as DriveRoot); break
                case "FILE": drivefile = new DriveFile(file._id, file.drive_id, null, new Date(), new Date(), file.name, new User("none",  "none"), permissions, new User("none",  "none"), file.mime_type); break
                case "FOLDER": drivefile = new DriveFolder(file._id, file.drive_id, null, new Date(), new Date(), file.name, new User("none",  "none"), permissions, new User("none",  "none"), file.mime_type, []); break
                default: throw new Error("file does not have a valid type")
            }
            idToDriveFile.set(file._id.toString(), [drivefile, file.children])
        })
        idToDriveFile.forEach(([file, childrenIDs]: [DriveFile, Types.ObjectId[]], key: string) => {
            if (childrenIDs.length === 0) return
            childrenIDs.forEach((childID: Types.ObjectId) => {
                let child: DriveFile = (idToDriveFile.get(childID.toString()) as [DriveFile, Types.ObjectId[]])[0];
                (file as DriveFolder).children.push(child);
                child.parent = (file as DriveFolder)
            })
        })
        return new FileInfoSnapshot(snapshot._id, snapshot.createdAt, roots, snapshot.updatedAt)
    }

    applyQuery(query: Query): DriveFile[] {
        let f: QueryPredicate = operatorToQueryPredicate[query.operator]
        let all_files: DriveFile[] = this.drive_roots.flatMap((d: DriveRoot) => d.getSubtree())     
        return all_files.filter((d: DriveFile) => f(query.argument, d))
    }
    
    serialize(): FileInfoSnapshot {
        let save_drive_roots = this.drive_roots
        this.drive_roots = this.drive_roots.map((d: DriveRoot) => d.serialize())
        let copy: FileInfoSnapshot = structuredClone(this)
        this.drive_roots = save_drive_roots
        return copy
    }

    async save(callback: (err: Error) => void): Promise<Types.ObjectId> {
        const files = this.drive_roots.flatMap((d: DriveRoot) => d.getModel())
<<<<<<< HEAD:server/classes/FileInfoSnapshot.ts
        const snapshotModel = new Models.FileSnapshotModel({ user_id: this._id, files: files })
        let res: any
        try {
            res = await snapshotModel.save()
        } catch (e) {
            console.log("Error saving file snapshot: ", e)
        }
        return res._id
=======
        const snapshotModel = new Models.FileSnapshotModel(
            {
                user_id: this.userId,
                files: files
            }
        )

        snapshotModel.save((err, result) => {
            if(err){
                console.log("Error saving file snapshot: ", err)
            }
        })

>>>>>>> origin/retrieveSnapshots:server/classes/Structures/FileInfoSnapshot.ts
    }

    static async createNew(userId:Types.ObjectId, roots: DriveRoot[]): Promise<FileInfoSnapshot>{
        //convert the tree structure to a list of documents
        const files = roots.flatMap((d: DriveRoot) => d.getModel())
        
        //create new model
        let snapshotModel: any = new Models.FileSnapshotModel(
            {
                user_id: userId,
                files: files
            }
        )

        //save the model
        try{
           snapshotModel = await snapshotModel.save()
        }catch (err){
            console.log("Error saving snapshot model: ", err)
        }
        
        return new FileInfoSnapshot(
            snapshotModel._id,
            snapshotModel.userId,
            roots, 
            snapshotModel.updatedAt,
            snapshotModel.createdAt
        )
    }

    toString(): string {
        let depth: number = 0
        let s = "\t".repeat(depth) + "Type: " + this.constructor.name + "\n"
        for (let i = 0; i < this.drive_roots.length; i++) {
            let child: DriveFile = this.drive_roots[i]
            s = s + child.toString(depth+1) 
        }
        return s
    }
}