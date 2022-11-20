import { Types } from "mongoose"
import { Permission } from "."
import Models from "../../db/Models"
import { operatorToQueryPredicate, QueryPredicate } from "../../predicates"
import { DriveFile, DriveFolder, DriveRoot } from "../FilesClasses"
import { Query, User } from "../UserClasses"

export class FileInfoSnapshot {
    constructor (
        public _id: string,
        public drive_roots: DriveRoot[], 
        public date_updated: Date,
        public date_created: Date
    ) {}

    static async retrieve(id: Types.ObjectId): Promise<FileInfoSnapshot> {
        let snapshot: any = await Models.FileSnapshotModel.findById(id)
        // console.log("snapshot: ", JSON.stringify(snapshot, null, "\t"))
        let roots: DriveRoot[] = []
        let idToDriveFile: Map<string, [DriveFile, Types.ObjectId[]]> = new Map<string, [DriveFile, Types.ObjectId[]]>()
        snapshot.files.forEach((file: any) => {
            let permissions: Permission[] = file.permissions.map((p: any) => new Permission(p._id.toString(), p.drive_id, new User(p.type, p.grantedTo.email,  p.grantedTo.display_name), p.role))
            let drivefile: DriveFile
            switch (file.type) {
                case "ROOT": drivefile = new DriveRoot(file._id.toString(), file.drive_id, file.name, [], false); roots.push(drivefile as DriveRoot); break
                case "FILE": drivefile = new DriveFile(file._id.toString(), file.drive_id, null, new Date(), new Date(), file.name, (file.owner ? new User(file.owner.type, file.owner.email, file.owner.display_name) : null), permissions, new User(file.sharedBy?.type, file.sharedBy?.email, file.sharedBy?.display_name), file.mime_type); break
                case "FOLDER": drivefile = new DriveFolder(file._id.toString(), file.drive_id, null, new Date(), new Date(), file.name, (file.owner ? new User(file.owner.type, file.owner.email, file.owner.display_name) : null), permissions, new User(file.sharedBy?.type, file.sharedBy?.email, file.sharedBy?.display_name), file.mime_type, []); break
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
        return new FileInfoSnapshot(snapshot._id.toString(), roots, snapshot.createdAt, snapshot.updatedAt)
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
        const snapshotModel = new Models.FileSnapshotModel({ files: files })
        let res: any
        try {
            res = await snapshotModel.save()
        } catch (e) {
            console.log("Error saving file snapshot: ", e)
        }
        return res._id
    }

    static async createNew(userId:Types.ObjectId, roots: DriveRoot[]): Promise<FileInfoSnapshot>{
        //convert the tree structure to a list of documents
        const files = roots.flatMap((d: DriveRoot) => d.getModel())
        
        //create new model
        let snapshotModel: any = new Models.FileSnapshotModel({ files: files })

        //save the model
        try{
           snapshotModel = await snapshotModel.save()
        }catch (err){
            console.log("Error saving snapshot model: ", err)
        }
        
        return new FileInfoSnapshot(
            snapshotModel._id.toString(),
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