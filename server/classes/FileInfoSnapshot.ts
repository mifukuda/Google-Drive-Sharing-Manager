import { DriveRoot } from "./DriveRoot"
import { DriveFile } from "./DriveFile"
import { Query } from "./Query"
import { operatorToQueryPredicate, QueryPredicate } from "../predicates"
import Models from "../db/Models"
import { Types } from "mongoose"

export class FileInfoSnapshot {
    constructor (
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public drive_roots: DriveRoot[], 
        public date_updated: Date,
        public date_created: Date
    ) {}

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

    save(callback: (err: Error) => void): void {
        const files = this.drive_roots.flatMap((d: DriveRoot) => d.getModel())
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
            snapshotModel.files, 
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